// src/components/Sorteo.js
import React, {useState, useEffect, useCallback} from 'react';
import {
  DndContext,
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

function SortableItem (props) {
  const {id, nombre_item, cantidad, index, onDelete} = props;
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
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Se aplican los listeners únicamente al texto para el drag */}
        <span {...listeners} style={{cursor: 'grab'}}>
          <strong>{index + 1}°</strong> {nombre_item} - Cantidad: {cantidad}
        </span>
        <button
          className="rojo d-flex"
          onClick={e => {
            e.stopPropagation ();
            onDelete (id);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            style={{
              width: '16px',
              height: '16px',
              fill: 'white',
            }}
          >
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
          Eliminar
        </button>
      </div>
    </li>
  );
}

function Modal({children, onClose}) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
        <button className="modal-close" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}

function Sorteo () {
  // Para evitar el warning "no-useless-escape", reescribimos la regex para remover los caracteres "[" y "]"
  const parseErrorMessage = errorMsg => {
    if (typeof errorMsg === 'string') {
      // Remueve los caracteres "[" y "]" sin escapes innecesarios
      let cleaned = errorMsg.replace(/[[]\]]/g, '');

      cleaned = cleaned.replace (
        /ErrorDetail\(string='(.*?)', code='.*?'\)/,
        '$1'
      );
      return cleaned;
    }
    return errorMsg;
  };

  // Estados del formulario de sorteo
  const [activeSection, setActiveSection] = useState ('crear');
  const [nombreSorteo, setNombreSorteo] = useState ('');
  const [descripcion, setDescripcion] = useState ('');
  const [programarSorteo, setProgramarSorteo] = useState (false);
  const [scheduledDate, setScheduledDate] = useState ('');
  const [sorteoAgendado, setSorteoAgendado] = useState (false);
  const [scheduledSorteos, setScheduledSorteos] = useState ([]);
  const [selectedScheduledSorteoId, setSelectedScheduledSorteoId] = useState (
    ''
  );

  // Estados para filtros opcionales
  const [usarFiltros, setUsarFiltros] = useState (false);
  const [provincias, setProvincias] = useState ([]);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState ('');
  const [localidades, setLocalidades] = useState ([]);
  const [localidadSeleccionada, setLocalidadSeleccionada] = useState ('');
  const [appliedFilter, setAppliedFilter] = useState ({
    provincia: '',
    localidad: '',
  });
  const [filteredParticipants, setFilteredParticipants] = useState ([]);

  // Estado para la base activa de participantes
  const [participantsCount, setParticipantsCount] = useState (null);

  // Estados para premios a sortear
  const [items, setItems] = useState ([]);
  const [availablePremios, setAvailablePremios] = useState ([]);
  const [selectedPremioId, setSelectedPremioId] = useState ('');
  const [selectedPremioCantidad, setSelectedPremioCantidad] = useState (1);

  // Estados para el modal de resultado
  const [showModal, setShowModal] = useState (false);
  const [modalResult, setModalResult] = useState (null);

  // Estado de carga
  const [cargando, setCargando] = useState (false);

  // Sensores para drag & drop
  const sensors = useSensors (
    useSensor (PointerSensor),
    useSensor (KeyboardSensor)
  );

  const location = useLocation ();

  // Obtener la base activa de participantes
  useEffect (() => {
    fetch (`${API_BASE_URL}/api/lists/`)
      .then (res => res.json ())
      .then (data => {
        setParticipantsCount (
          data.participantes ? data.participantes.length : 0
        );
      })
      .catch (err => {
        console.error (err);
        toast.error ('Error al cargar participantes.');
      });
  }, []);

  // Si se navega desde sorteos agendados, cargar sus datos
  useEffect (
    () => {
      if (location.state && location.state.scheduledSorteo) {
        const scheduled = location.state.scheduledSorteo;
        setNombreSorteo (scheduled.nombre || '');
        setDescripcion (scheduled.descripcion || '');
        setProvinciaSeleccionada (scheduled.provincia || '');
        setLocalidadSeleccionada (scheduled.localidad || '');
        setUsarFiltros (true);
        setAppliedFilter ({
          provincia: scheduled.provincia || '',
          localidad: scheduled.localidad || '',
        });
        if (scheduled.fecha_programada) {
          const dt = new Date (scheduled.fecha_programada);
          const isoString = dt.toISOString ().slice (0, 16);
          setScheduledDate (isoString);
        } else {
          setScheduledDate ('');
        }
        if (scheduled.premios && scheduled.premios.length > 0) {
          const premiosConStock = scheduled.premios.filter (
            p => p.premio.stock > 0
          );
          scheduled.premios.forEach (p => {
            if (p.premio.stock <= 0) {
              toast.error (`No hay stock para el premio ${p.premio.nombre}`);
            }
          });
          const premiosItems = premiosConStock.map (p => ({
            id: p.premio.id,
            nombre_item: p.premio.nombre,
            cantidad: p.cantidad,
            stock: p.premio.stock,
          }));
          setItems (premiosItems);
        } else {
          setItems ([]);
        }
        setProgramarSorteo (false);
        setSorteoAgendado (false);
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
        setAppliedFilter ({provincia: '', localidad: ''});
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

  const handleProvinciaChange = e => {
    setProvinciaSeleccionada (e.target.value);
    setLocalidadSeleccionada ('');
    setAppliedFilter ({provincia: '', localidad: ''});
  };

  const handleAplicarFiltro = () => {
    setAppliedFilter ({
      provincia: provinciaSeleccionada,
      localidad: localidadSeleccionada,
    });
    const filtroTexto = provinciaSeleccionada || localidadSeleccionada
      ? `Filtro aplicado: ${provinciaSeleccionada}${localidadSeleccionada ? ', ' + localidadSeleccionada : ''}`
      : 'No se aplicó ningún filtro';
    toast.success (filtroTexto);
  };

  const handleProgramarSorteoChange = () => {
    const nuevoValor = !programarSorteo;
    setProgramarSorteo (nuevoValor);
    if (nuevoValor) {
      setSorteoAgendado (false);
    } else {
      setScheduledDate ('');
    }
  };

  const handleSorteoAgendadoChange = () => {
    const nuevoValor = !sorteoAgendado;
    setSorteoAgendado (nuevoValor);
    if (nuevoValor) {
      setProgramarSorteo (false);
      fetch (`${API_BASE_URL}/api/scheduled/`)
        .then (res => res.json ())
        .then (data => setScheduledSorteos (data))
        .catch (err => {
          console.error (err);
          toast.error ('Error al cargar sorteos agendados.');
        });
    } else {
      setSelectedScheduledSorteoId ('');
    }
  };

  const handleScheduledSorteoSelect = e => {
    const id = e.target.value;
    setSelectedScheduledSorteoId (id);
    const selected = scheduledSorteos.find (s => String (s.id) === id);
    if (selected) {
      setNombreSorteo (selected.nombre || '');
      setDescripcion (selected.descripcion || '');
      setProvinciaSeleccionada (selected.provincia || '');
      setLocalidadSeleccionada (selected.localidad || '');
      if (selected.fecha_programada) {
        const dt = new Date (selected.fecha_programada);
        const isoString = dt.toISOString ().slice (0, 16);
        setScheduledDate (isoString);
      } else {
        setScheduledDate ('');
      }
      if (selected.premios && selected.premios.length > 0) {
        const premiosConStock = selected.premios.filter (
          p => p.premio.stock > 0
        );
        selected.premios.forEach (p => {
          if (p.premio.stock <= 0) {
            toast.error (`No hay stock para el premio ${p.premio.nombre}`);
          }
        });
        const premiosItems = premiosConStock.map (p => ({
          id: p.premio.id,
          nombre_item: p.premio.nombre,
          cantidad: p.cantidad,
          stock: p.premio.stock,
        }));
        setItems (premiosItems);
      } else {
        setItems ([]);
      }
      if (selected.provincia || selected.localidad) {
        setUsarFiltros (true);
        setAppliedFilter ({
          provincia: selected.provincia || '',
          localidad: selected.localidad || '',
        });
      }
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
    // Al agregar, se guarda también el valor "stock"
    setItems ([
      ...items,
      {
        id: premio.id,
        nombre_item: premio.nombre,
        cantidad: selectedPremioCantidad,
        stock: premio.stock,
      },
    ]);
    setAvailablePremios (availablePremios.filter (p => p.id !== premio.id));
    setSelectedPremioId ('');
    setSelectedPremioCantidad (1);
    toast.success (`Premio "${premio.nombre}" agregado al sorteo.`);
  };

  const handleEliminarPremio = id => {
    const removedPrize = items.find (item => String (item.id) === String (id));
    setItems (prevItems =>
      prevItems.filter (item => String (item.id) !== String (id))
    );
    if (removedPrize) {
      setAvailablePremios (prevAvailable => {
        const exists = prevAvailable.find (
          p => String (p.id) === String (removedPrize.id)
        );
        if (!exists) {
          return [
            ...prevAvailable,
            {
              id: removedPrize.id,
              nombre: removedPrize.nombre_item,
              stock: removedPrize.stock,
            },
          ];
        }
        return prevAvailable;
      });
    }
  };

  const handleDragEnd = event => {
    const {active, over} = event;
    if (!over || items.length < 2) return;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex (item => item.id === active.id);
      const newIndex = items.findIndex (item => item.id === over.id);
      setItems (arrayMove (items, oldIndex, newIndex));
    }
  };

  const fetchFilteredParticipants = useCallback (
    async () => {
      try {
        const response = await fetch (`${API_BASE_URL}/api/lists/`);
        const data = await response.json ();
        const allParticipants = data.participantes || [];
        const filtered = allParticipants.filter (p => {
          let match = true;
          if (appliedFilter.provincia) {
            match = match && p.provincia === appliedFilter.provincia;
          }
          if (appliedFilter.localidad) {
            match = match && p.localidad === appliedFilter.localidad;
          }
          return match;
        });
        setFilteredParticipants (filtered);
      } catch (error) {
        console.error (error);
        toast.error ('Error al cargar participantes.');
      }
    },
    [appliedFilter]
  );

  useEffect (
    () => {
      if (usarFiltros && (appliedFilter.provincia || appliedFilter.localidad)) {
        fetchFilteredParticipants ();
      } else {
        setFilteredParticipants ([]);
      }
    },
    [usarFiltros, appliedFilter, fetchFilteredParticipants]
  );

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
      provincia: appliedFilter.provincia || '',
      localidad: appliedFilter.localidad || '',
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
          resetForm ();
        } else {
          toast.error (
            parseErrorMessage (data.error) || 'Error al agendar el sorteo.'
          );
        }
      } else {
        const response = await fetch (`${API_BASE_URL}/api/sortear/`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify (payload),
        });
        const data = await response.json ();
        if (response.ok) {
          setModalResult (data);
          setShowModal (true);
          fetchAvailablePremios ();
          if (selectedScheduledSorteoId) {
            await fetch (
              `${API_BASE_URL}/api/scheduled/${selectedScheduledSorteoId}/`,
              {
                method: 'DELETE',
              }
            );
          }
          resetForm ();
          toast.success ('Sorteo realizado exitosamente.');
        } else {
          toast.error (parseErrorMessage (data.error) || 'Error al sortear');
        }
      }
    } catch (err) {
      console.error ('Error de conexión:', err);
      toast.error ('Error de conexión');
    } finally {
      setCargando (false);
    }
  };

  const resetForm = () => {
    setNombreSorteo ('');
    setDescripcion ('');
    setItems ([]);
    setScheduledDate ('');
    setProvinciaSeleccionada ('');
    setLocalidadSeleccionada ('');
    setUsarFiltros (false);
    setAppliedFilter ({provincia: '', localidad: ''});
    setProgramarSorteo (false);
    setSorteoAgendado (false);
    setSelectedScheduledSorteoId ('');
  };

  return (
    <div className="sorteo-container">
      <h1>Realizar Sorteo</h1>
      {activeSection === 'crear' &&
        <div className="accordion-content">
          <div className="sorteo-section">
            <label className="check">
              <input
                type="checkbox"
                checked={sorteoAgendado}
                onChange={handleSorteoAgendadoChange}
              />
              Sorteo agendado
            </label>
            {sorteoAgendado &&
              <div className="sorteo-section">
                <label>Seleccioná un sorteo agendado:</label>
                <select
                  value={selectedScheduledSorteoId}
                  onChange={handleScheduledSorteoSelect}
                >
                  <option value="">-- Seleccionar sorteo agendado --</option>
                  {scheduledSorteos.map (sorteo => (
                    <option key={sorteo.id} value={sorteo.id}>
                      {sorteo.nombre}
                      {' '}
                      (
                      {new Date (sorteo.fecha_programada).toLocaleString ()}
                      )
                    </option>
                  ))}
                </select>
              </div>}
          </div>
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
                  onChange={handleProvinciaChange}
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
                  <option value="">-- Seleccionar localidad --</option>
                  {localidades.map ((loc, idx) => (
                    <option key={idx} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
              <div className="half bottom">
                <button onClick={handleAplicarFiltro}>Aplicar Filtro</button>
              </div>
            </div>}
          {usarFiltros &&
            <div className="sorteo-section filtrotxt">
              <p>
                {appliedFilter.provincia || appliedFilter.localidad
                  ? `Filtro aplicado: ${appliedFilter.provincia}${appliedFilter.localidad ? ', ' + appliedFilter.localidad : ''}`
                  : 'No se aplicó ningún filtro'}
              </p>
            </div>}
          <hr />
          <div className="sorteo-section">
            <label>
              <input
                type="checkbox"
                checked={programarSorteo}
                onChange={handleProgramarSorteoChange}
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
          <div className="sorteo-section">
            <h4>Agregar Premios al Sorteo</h4>
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
              onChange={e =>
                setSelectedPremioCantidad (Number (e.target.value))}
              min="1"
              style={{marginLeft: '10px', width: '60px'}}
            />
            <button
              onClick={agregarPremioAlSorteo}
              style={{marginLeft: '10px'}}
            >
              Agregar Premio
            </button>
          </div>
          {items.length > 0 &&
            <div className="sorteo-section">
              <h4>Premios agregados</h4>
              <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
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
                        onDelete={handleEliminarPremio}
                      />
                    ))}
                  </ul>
                </SortableContext>
              </DndContext>
            </div>}
        </div>}
      {activeSection === 'realizar' &&
        <div className="accordion-content">
          <h2>Resumen del sorteo</h2>
          <p>
            <strong>Nombre:</strong> {nombreSorteo || 'N/A'}
          </p>
          {descripcion &&
            <p>
              <strong>Descripción:</strong> {descripcion}
            </p>}
          <p>
            <strong>Filtro aplicado:</strong>{' '}
            {appliedFilter.provincia || appliedFilter.localidad
              ? `${appliedFilter.provincia}${appliedFilter.localidad ? ', ' + appliedFilter.localidad : ''}`
              : 'Ninguno'}
          </p>
          <p>
            <strong>Premios:</strong>{' '}
            {items.length > 0
              ? items
                  .map (item => `${item.nombre_item} (x${item.cantidad})`)
                  .join (', ')
              : 'Sin premios'}
          </p>
          <div className="participants-summary">
            <strong>Participantes:</strong>
            {usarFiltros
              ? filteredParticipants.length > 0
                  ? <ul>
                      {filteredParticipants.map (p => (
                        <li key={p.id}>
                          {p.nombre} {p.apellido} ({p.email})
                        </li>
                      ))}
                    </ul>
                  : <p>No hay participantes que cumplan el filtro.</p>
              : <p>
                  Se realizará el sorteo sobre la base activa de participantes con
                  {' '}
                  {participantsCount !== null
                    ? participantsCount
                    : 'cargando...'}
                  {' '}
                  participantes.
                </p>}
          </div>
          <div className="sortear">
            <button
              onClick={handleSortear}
              className="ejecutar"
              disabled={cargando}
            >
              {cargando
                ? <ClipLoader size={20} color="#ffffff" />
                : programarSorteo ? 'Agendar sorteo' : 'Sortear'}
            </button>
          </div>
        </div>}
      <hr />
      <div className="accordion-toggle">
        {activeSection === 'crear'
          ? <button
              className="ejecutar"
              onClick={() => setActiveSection ('realizar')}
              disabled={!(nombreSorteo.trim () && items.length > 0)}
            >
              Realizar sorteo
            </button>
          : <button
              className="azul volver"
              onClick={() => setActiveSection ('crear')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                style={{width: '16px', height: '16px', fill: 'white'}}
              >
                <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
              </svg>
              Volver a Crear sorteo
            </button>}
      </div>
      {showModal &&
        modalResult &&
        <Modal
          onClose={() => {
            setShowModal (false);
            resetForm ();
            setActiveSection ('crear');
          }}
        >
          <h2>Resultado del Sorteo</h2>
          <p>
            <strong>ID:</strong>
            {' '}
            {modalResult.sorteo_id}
            {' '}
            -
            {' '}
            <strong>Nombre:</strong>
            {' '}
            {modalResult.nombre_sorteo}
          </p>
          {modalResult.items && modalResult.items.length > 0
            ? <ul>
                {modalResult.items.map ((itemObj, i) => (
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
            : <p>Sin resultados.</p>}
        </Modal>}
    </div>
  );
}

export default Sorteo;
