// sorteo-frontend/src/components/Sorteo.js

import React, {useState, useEffect} from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {toast} from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import './Sorteo.css';
import {API_BASE_URL} from '../config';
import {useLocation} from 'react-router-dom';

//
// Componente para cada ítem ordenable
//
function SortableItem (props) {
  const {id, nombre_item, cantidad, index} = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable ({id});
  const style = {
    transform: CSS.Transform.toString (transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    padding: '8px',
    marginBottom: '5px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#fff',
    cursor: 'grab',
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <strong>{index + 1}°</strong> {nombre_item} - Cantidad: {cantidad}
    </li>
  );
}

//
// Componente Sorteo
//
function Sorteo () {
  // Campos básicos del sorteo
  const [nombreSorteo, setNombreSorteo] = useState ('');
  const [descripcion, setDescripcion] = useState ('');

  // Toggle para agendar sorteo y campo para fecha programada
  const [programarSorteo, setProgramarSorteo] = useState (false);
  const [scheduledDate, setScheduledDate] = useState ('');

  // Filtros opcionales
  const [usarFiltros, setUsarFiltros] = useState (false);
  const [provincias, setProvincias] = useState ([]);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState ('');
  const [localidades, setLocalidades] = useState ([]);
  const [localidadSeleccionada, setLocalidadSeleccionada] = useState ('');
  // Estado para guardar el filtro aplicado
  const [appliedFilter, setAppliedFilter] = useState ({
    province: '',
    locality: '',
  });

  // Premios a sortear
  const [items, setItems] = useState ([]);
  const [availablePremios, setAvailablePremios] = useState ([]);
  const [selectedPremioId, setSelectedPremioId] = useState ('');
  const [selectedPremioCantidad, setSelectedPremioCantidad] = useState (1);

  // Resultado del sorteo
  const [resultado, setResultado] = useState (null);

  // Indicador de carga
  const [cargando, setCargando] = useState (false);

  // Sensores para drag & drop
  const sensors = useSensors (
    useSensor (PointerSensor),
    useSensor (KeyboardSensor)
  );

  const location = useLocation ();

  // Precarga de datos si se viene de "Sorteos programados"
  useEffect (
    () => {
      if (location.state && location.state.scheduledSorteo) {
        const scheduled = location.state.scheduledSorteo;
        setNombreSorteo (scheduled.nombre || '');
        setDescripcion (scheduled.descripcion || '');
        setProvinciaSeleccionada (scheduled.provincia || '');
        setLocalidadSeleccionada (scheduled.localidad || '');
        setAppliedFilter ({
          province: scheduled.provincia || '',
          locality: scheduled.localidad || '',
        });
        if (scheduled.fecha_programada) {
          const dt = new Date (scheduled.fecha_programada);
          const isoString = dt.toISOString ().slice (0, 16);
          setScheduledDate (isoString);
        }
        if (scheduled.premios && scheduled.premios.length > 0) {
          const premiosItems = scheduled.premios.map (sp => ({
            id: sp.premio.id,
            nombre_item: sp.premio.nombre,
            cantidad: sp.cantidad,
          }));
          setItems (premiosItems);
        }
        // Forzar que el toggle de agendar sorteo quede desmarcado para operar en modo sorteo
        setProgramarSorteo (false);
        window.history.replaceState ({}, document.title);
      }
    },
    [location.state]
  );

  // Cargar provincias
  useEffect (
    () => {
      if (usarFiltros) {
        fetch (`${API_BASE_URL}/api/provincias/`)
          .then (res => res.json ())
          .then (data => setProvincias (data))
          .catch (err => {
            console.error (err);
            toast.error ('Error al cargar provincias.');
          });
      } else {
        setProvincias ([]);
        setProvinciaSeleccionada ('');
        setLocalidades ([]);
        setLocalidadSeleccionada ('');
      }
    },
    [usarFiltros]
  );

  // Cargar localidades según la provincia
  useEffect (
    () => {
      if (usarFiltros && provinciaSeleccionada) {
        fetch (
          `${API_BASE_URL}/api/localidades/?provincia=${provinciaSeleccionada}`
        )
          .then (res => res.json ())
          .then (data => setLocalidades (data))
          .catch (err => {
            console.error (err);
            toast.error ('Error al cargar localidades.');
          });
      } else {
        setLocalidades ([]);
        setLocalidadSeleccionada ('');
      }
    },
    [usarFiltros, provinciaSeleccionada]
  );

  // Cargar premios disponibles
  useEffect (() => {
    fetchAvailablePremios ();
  }, []);

  const fetchAvailablePremios = async () => {
    try {
      const response = await fetch (`${API_BASE_URL}/api/premios/`);
      const data = await response.json ();
      const available = data.filter (p => p.stock > 0);
      setAvailablePremios (available);
    } catch (error) {
      console.error ('Error al obtener los premios:', error);
      toast.error ('Error al obtener los premios.');
    }
  };

  const agregarPremioAlSorteo = () => {
    if (!selectedPremioId) {
      toast.error ('Por favor, seleccioná un premio.');
      return;
    }
    const premio = availablePremios.find (
      p => p.id === parseInt (selectedPremioId)
    );
    if (!premio) {
      toast.error ('Premio no encontrado.');
      return;
    }
    if (selectedPremioCantidad < 1) {
      toast.error ('La cantidad debe ser al menos 1.');
      return;
    }
    if (selectedPremioCantidad > premio.stock) {
      toast.error (
        `No hay suficiente stock para el premio ${premio.nombre}. Stock disponible: ${premio.stock}`
      );
      return;
    }
    setItems ([
      ...items,
      {
        id: premio.id,
        nombre_item: premio.nombre,
        cantidad: selectedPremioCantidad,
      },
    ]);
    setAvailablePremios (availablePremios.filter (p => p.id !== premio.id));
    setSelectedPremioId ('');
    setSelectedPremioCantidad (1);
    toast.success (`Premio "${premio.nombre}" agregado al sorteo.`);
  };

  // (La función eliminarPremioDelSorteo sigue existiendo pero no se usa en este flujo)
  const eliminarPremioDelSorteo = id => {
    const premio = items.find (p => p.id === id);
    if (!premio) return;
    setItems (items.filter (p => p.id !== id));
    setAvailablePremios ([
      ...availablePremios,
      {
        id: premio.id,
        nombre: premio.nombre_item,
        stock: premio.cantidad,
      },
    ]);
    toast.info (`Premio "${premio.nombre_item}" eliminado del sorteo.`);
  };

  const handleDragEnd = event => {
    const {active, over} = event;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex (item => item.id === active.id);
      const newIndex = items.findIndex (item => item.id === over.id);
      setItems (arrayMove (items, oldIndex, newIndex));
    }
  };

  // Función para aplicar el filtro de provincia/localidad
  const handleApplyFilter = () => {
    setAppliedFilter ({
      province: provinciaSeleccionada,
      locality: localidadSeleccionada,
    });
    toast.info ('Filtro aplicado.');
  };

  const handleSortear = async () => {
    if (items.length === 0) {
      toast.error ('Por favor, agregá al menos un premio para sortear.');
      return;
    }
    const premiosConOrden = items.map ((it, index) => ({
      premio_id: it.id,
      orden_item: index + 1,
      cantidad: it.cantidad,
    }));
    const payload = {
      nombre: nombreSorteo,
      descripcion: descripcion,
      premios: premiosConOrden,
      provincia: appliedFilter.province || '',
      localidad: appliedFilter.locality || '',
    };
    if (programarSorteo) {
      if (!scheduledDate) {
        toast.error (
          'Por favor, ingresá la fecha y hora para agendar el sorteo.'
        );
        return;
      }
      payload.fecha_programada = scheduledDate;
    }
    setCargando (true);
    try {
      if (programarSorteo) {
        const response = await fetch (`${API_BASE_URL}/api/scheduled/`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify (payload),
        });
        const data = await response.json ();
        if (response.ok) {
          toast.success (data.message || 'Sorteo agendado exitosamente.');
          setNombreSorteo ('');
          setDescripcion ('');
          setItems ([]);
          setScheduledDate ('');
        } else {
          toast.error (data.error || 'Error al agendar el sorteo.');
          setResultado (null);
        }
      } else {
        const response = await fetch (`${API_BASE_URL}/api/sortear/`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify (payload),
        });
        const data = await response.json ();
        if (response.ok) {
          setResultado (data);
          fetchAvailablePremios ();
          setNombreSorteo ('');
          setDescripcion ('');
          setItems ([]);
          toast.success ('Sorteo realizado exitosamente.');
        } else {
          toast.error (data.error || 'Error al sortear');
          setResultado (null);
        }
      }
    } catch (err) {
      console.error ('Error de conexión:', err);
      toast.error ('Error de conexión');
      setResultado (null);
    } finally {
      setCargando (false);
    }
  };

  const handleNuevoSorteo = () => {
    setResultado (null);
  };

  return (
    <div className="sorteo-container">
      <h1>Realizar Sorteo</h1>
      {/* Encabezado: Nombre y Descripción en la misma línea */}
      <div className="sorteo-header">
        <div className="sorteo-input-group">
          <label>Nombre del sorteo:</label>
          <input
            type="text"
            value={nombreSorteo}
            onChange={e => setNombreSorteo (e.target.value)}
            placeholder="Nombre del sorteo"
          />
        </div>
        <div className="sorteo-input-group">
          <label>Descripción:</label>
          <input
            type="text"
            value={descripcion}
            onChange={e => setDescripcion (e.target.value)}
            placeholder="Descripción del sorteo"
          />
        </div>
      </div>
      <hr />
      {/* Filtros: Toggle de restricción y botones para aplicar filtro */}
      <div className="sorteo-section">
        <label>
          <input
            type="checkbox"
            checked={usarFiltros}
            onChange={() => setUsarFiltros (!usarFiltros)}
          />
          ¿Restringir por provincia/localidad?
        </label>
      </div>
      {usarFiltros &&
        <div className="sorteo-section d-flex">
          <div className="half">
            <label>Provincia:</label>
            <select
              value={provinciaSeleccionada}
              onChange={e => setProvinciaSeleccionada (e.target.value)}
            >
              <option value="">-- Seleccionar provincia --</option>
              {provincias.map ((prov, idx) => (
                <option key={idx} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
          </div>
          <div className="half">
            <label>Localidad:</label>
            <select
              value={localidadSeleccionada}
              onChange={e => setLocalidadSeleccionada (e.target.value)}
              disabled={!provinciaSeleccionada}
            >
              <option value="">-- Seleccionar localidad (opcional) --</option>
              {localidades.map ((loc, idx) => (
                <option key={idx} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
          <div className="half" style={{alignSelf: 'flex-end'}}>
            <button onClick={handleApplyFilter} className="ejecutar">
              Aplicar filtro
            </button>
          </div>
        </div>}
      {/* Mostrar el filtro aplicado */}
      {usarFiltros &&
        appliedFilter.province &&
        <div className="sorteo-section">
          <p>
            Filtro aplicado:
            {` Provincia: ${appliedFilter.province}`}
            {appliedFilter.locality
              ? `, Localidad: ${appliedFilter.locality}`
              : ''}
          </p>
        </div>}
      <hr />
      {/* Toggle para agendar sorteo */}
      <div className="sorteo-section">
        <label>
          <input
            type="checkbox"
            checked={programarSorteo}
            onChange={() => setProgramarSorteo (!programarSorteo)}
          />
          Agendar sorteo
        </label>
        {programarSorteo &&
          <div className="sorteo-section">
            <label>Fecha y hora:</label>
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={e => setScheduledDate (e.target.value)}
            />
          </div>}
      </div>
      <hr />
      {/* Agregar Premios */}
      <h4>Agregar Premios al Sorteo</h4>
      <div className="sorteo-section">
        <label>Seleccioná un premio:</label>
        <select
          value={selectedPremioId}
          onChange={e => setSelectedPremioId (e.target.value)}
        >
          <option value="">-- Seleccionar premio --</option>
          {availablePremios.map (premio => (
            <option key={premio.id} value={premio.id}>
              {premio.nombre} (Stock: {premio.stock})
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Cantidad"
          value={selectedPremioCantidad}
          onChange={e => setSelectedPremioCantidad (Number (e.target.value))}
          min="1"
          style={{marginLeft: '10px', width: '60px'}}
        />
        <button onClick={agregarPremioAlSorteo} style={{marginLeft: '10px'}}>
          Agregar Premio
        </button>
      </div>
      {/* Lista de premios agregados (drag & drop) */}
      {items.length > 0 &&
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <SortableContext
            items={items.map (item => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="sorteo-list">
              {items.map ((item, index) => (
                <SortableItem
                  key={item.id}
                  id={item.id}
                  nombre_item={item.nombre_item}
                  cantidad={item.cantidad}
                  index={index}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>}
      <hr />
      <div className="sortear">
        {resultado
          ? <button onClick={handleNuevoSorteo} className="ejecutar">
              Realizar nuevo sorteo
            </button>
          : <button
              onClick={handleSortear}
              className="ejecutar"
              disabled={cargando}
            >
              {cargando
                ? <ClipLoader size={20} color="#ffffff" />
                : programarSorteo ? 'Agendar sorteo' : 'Sortear'}
            </button>}
      </div>
      {resultado &&
        <div className="sorteo-result">
          <h2>Resultado del Sorteo</h2>
          <p>ID: {resultado.sorteo_id} - Nombre: {resultado.nombre_sorteo}</p>
          {resultado.items && resultado.items.length > 0
            ? <ul>
                {resultado.items.map ((itemObj, i) => (
                  <li key={i}>
                    <strong>{itemObj.orden_item}° Premio:</strong>
                    {' '}
                    {itemObj.nombre_item}
                    <ul>
                      {itemObj.ganadores.map ((ganador, j) => (
                        <li key={j}>
                          Ganador:
                          {' '}
                          {ganador.nombre}
                          {' '}
                          {ganador.apellido}
                          {' '}
                          (
                          {ganador.email}
                          )
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            : <p>Sin items en la respuesta.</p>}
        </div>}
    </div>
  );
}

export default Sorteo;
