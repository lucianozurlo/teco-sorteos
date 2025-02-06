// sorteo-frontend/src/components/Sorteo.js

import React, { useState, useEffect } from 'react';
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
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import './Sorteo.css';
import { API_BASE_URL } from '../config';

//
// Componente para cada ítem ordenable
//
function SortableItem(props) {
  const { id, nombre_item, cantidad, index } = props;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
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
function Sorteo() {
  // 1) Campos básicos del sorteo
  const [nombreSorteo, setNombreSorteo] = useState('');
  const [descripcion, setDescripcion] = useState('');

  // 2) Filtros (opcional)
  const [usarFiltros, setUsarFiltros] = useState(false);
  const [provincias, setProvincias] = useState([]);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState('');
  const [localidades, setLocalidades] = useState([]);
  const [localidadSeleccionada, setLocalidadSeleccionada] = useState('');

  // 3) Premios a sortear (con drag & drop)
  // Cada ítem: { id, nombre_item, cantidad }
  const [items, setItems] = useState([]);
  const [availablePremios, setAvailablePremios] = useState([]);
  const [selectedPremioId, setSelectedPremioId] = useState('');
  const [selectedPremioCantidad, setSelectedPremioCantidad] = useState(1);

  // 4) Resultado del sorteo
  const [resultado, setResultado] = useState(null);

  // 5) Indicador de carga
  const [cargando, setCargando] = useState(false);

  // Sensores para dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // Cargar provincias (si se usan filtros)
  useEffect(() => {
    if (usarFiltros) {
      fetch(`${API_BASE_URL}/api/provincias/`)
        .then(res => res.json())
        .then(data => setProvincias(data))
        .catch(err => {
          console.error(err);
          toast.error('Error al cargar provincias.');
        });
    } else {
      setProvincias([]);
      setProvinciaSeleccionada('');
      setLocalidades([]);
      setLocalidadSeleccionada('');
    }
  }, [usarFiltros]);

  // Cargar localidades cuando cambia la provincia
  useEffect(() => {
    if (usarFiltros && provinciaSeleccionada) {
      fetch(`${API_BASE_URL}/api/localidades/?provincia=${provinciaSeleccionada}`)
        .then(res => res.json())
        .then(data => setLocalidades(data))
        .catch(err => {
          console.error(err);
          toast.error('Error al cargar localidades.');
        });
    } else {
      setLocalidades([]);
      setLocalidadSeleccionada('');
    }
  }, [usarFiltros, provinciaSeleccionada]);

  // Cargar premios disponibles
  useEffect(() => {
    fetchAvailablePremios();
  }, []);

  const fetchAvailablePremios = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/premios/`);
      const data = await response.json();
      const available = data.filter(p => p.stock > 0);
      setAvailablePremios(available);
    } catch (error) {
      console.error('Error al obtener los premios:', error);
      toast.error('Error al obtener los premios.');
    }
  };

  // Agregar un premio seleccionado al sorteo
  const agregarPremioAlSorteo = () => {
    if (!selectedPremioId) {
      toast.error('Por favor, seleccioná un premio.');
      return;
    }
    const premio = availablePremios.find(p => p.id === parseInt(selectedPremioId));
    if (!premio) {
      toast.error('Premio no encontrado.');
      return;
    }
    if (selectedPremioCantidad < 1) {
      toast.error('La cantidad debe ser al menos 1.');
      return;
    }
    if (selectedPremioCantidad > premio.stock) {
      toast.error(`No hay suficiente stock para el premio ${premio.nombre}. Stock disponible: ${premio.stock}`);
      return;
    }
    setItems([
      ...items,
      {
        id: premio.id,
        nombre_item: premio.nombre,
        cantidad: selectedPremioCantidad,
      },
    ]);
    setAvailablePremios(availablePremios.filter(p => p.id !== premio.id));
    setSelectedPremioId('');
    setSelectedPremioCantidad(1);
    toast.success(`Premio "${premio.nombre}" agregado al sorteo.`);
  };

  // Eliminar un premio del sorteo
  // eslint-disable-next-line no-unused-vars
  const eliminarPremioDelSorteo = (id) => {
    const premio = items.find(p => p.id === id);
    if (!premio) return;
    setItems(items.filter(p => p.id !== id));
    setAvailablePremios([
      ...availablePremios,
      {
        id: premio.id,
        nombre: premio.nombre_item,
        stock: premio.cantidad,
      },
    ]);
    toast.info(`Premio "${premio.nombre_item}" eliminado del sorteo.`);
  };

  // Manejar el fin del Drag & Drop
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  // Ejecutar el sorteo
  const handleSortear = async () => {
    if (items.length === 0) {
      toast.error('Por favor, agregá al menos un premio para sortear.');
      return;
    }
    const premiosConOrden = items.map((it, index) => ({
      premio_id: it.id,
      orden_item: index + 1,
      cantidad: it.cantidad,
    }));
    const payload = {
      nombre: nombreSorteo,
      descripcion: descripcion,
      premios: premiosConOrden,
    };
    if (usarFiltros) {
      payload.provincia = provinciaSeleccionada;
      payload.localidad = localidadSeleccionada;
    }
    setCargando(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/sortear/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        setResultado(data);
        fetchAvailablePremios();
        setNombreSorteo('');
        setDescripcion('');
        setItems([]);
        toast.success('Sorteo realizado exitosamente.');
      } else {
        toast.error(data.error || 'Error al sortear');
        setResultado(null);
      }
    } catch (err) {
      console.error('Error de conexión:', err);
      toast.error('Error de conexión');
      setResultado(null);
    } finally {
      setCargando(false);
    }
  };

  // Programar sorteo
  const handleProgramarSorteo = async () => {
    const fechaProgramada = window.prompt(
      'Ingrese la fecha y hora para programar el sorteo (ej. 2025-02-28T15:00):'
    );
    if (!fechaProgramada) return;
    const payload = {
      nombre: nombreSorteo,
      descripcion: descripcion,
      premios: items.map((it, index) => ({
        premio_id: it.id,
        orden_item: index + 1,
        cantidad: it.cantidad,
      })),
      fecha_programada: fechaProgramada,
    };
    setCargando(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/schedule/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || 'Sorteo programado exitosamente.');
        setNombreSorteo('');
        setDescripcion('');
        setItems([]);
      } else {
        toast.error(data.error || 'Error al programar el sorteo.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error de conexión.');
    } finally {
      setCargando(false);
    }
  };

  // Reiniciar el sorteo para poder realizar uno nuevo
  const handleNuevoSorteo = () => {
    setResultado(null);
  };

  return (
    <div className="sorteo-container">
      <h1>Realizar Sorteo</h1>
      {/* Datos del sorteo */}
      <div className="sorteo-section">
        <label>Nombre del sorteo:</label>
        <input
          type="text"
          value={nombreSorteo}
          onChange={e => setNombreSorteo(e.target.value)}
          placeholder="Nombre del sorteo"
        />
      </div>
      <div className="sorteo-section">
        <label>Descripción:</label>
        <input
          type="text"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          placeholder="Descripción del sorteo"
        />
      </div>
      <hr />
      {/* Filtros */}
      <div className="sorteo-section">
        <label>
          <input
            type="checkbox"
            checked={usarFiltros}
            onChange={() => setUsarFiltros(!usarFiltros)}
          />
          ¿Restringir por provincia/localidad?
        </label>
      </div>
      {usarFiltros && (
        <div className="sorteo-section d-flex">
          <div className="half">
            <label>Provincia:</label>
            <select
              value={provinciaSeleccionada}
              onChange={e => setProvinciaSeleccionada(e.target.value)}
            >
              <option value="">-- Seleccionar provincia --</option>
              {provincias.map((prov, idx) => (
                <option key={idx} value={prov}>{prov}</option>
              ))}
            </select>
          </div>
          <div className="half">
            <label>Localidad:</label>
            <select
              value={localidadSeleccionada}
              onChange={e => setLocalidadSeleccionada(e.target.value)}
              disabled={!provinciaSeleccionada}
            >
              <option value="">-- Seleccionar localidad --</option>
              {localidades.map((loc, idx) => (
                <option key={idx} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>
      )}
      <hr />
      {/* Agregar Premios */}
      <h4>Agregar Premios al Sorteo</h4>
      <div className="sorteo-section">
        <label>Seleccioná un premio:</label>
        <select
          value={selectedPremioId}
          onChange={e => setSelectedPremioId(e.target.value)}
        >
          <option value="">-- Seleccionar premio --</option>
          {availablePremios.map(premio => (
            <option key={premio.id} value={premio.id}>
              {premio.nombre} (Stock: {premio.stock})
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Cantidad"
          value={selectedPremioCantidad}
          onChange={e => setSelectedPremioCantidad(Number(e.target.value))}
          min="1"
          style={{ marginLeft: '10px', width: '60px' }}
        />
        <button onClick={agregarPremioAlSorteo} style={{ marginLeft: '10px' }}>
          Agregar Premio
        </button>
      </div>
      {/* Lista de premios agregados (con drag & drop) */}
      {items.length > 0 && (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
          <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
            <ul className="sorteo-list">
              {items.map((item, index) => (
                <SortableItem key={item.id} id={item.id} nombre_item={item.nombre_item} cantidad={item.cantidad} index={index} />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
      <hr />
      <div className="sortear">
        {resultado ? (
          <button onClick={handleNuevoSorteo} className="ejecutar">
            Realizar nuevo sorteo
          </button>
        ) : (
          <>
            <button onClick={handleSortear} className="ejecutar" disabled={cargando}>
              {cargando ? <ClipLoader size={20} color="#ffffff" /> : 'Sortear'}
            </button>
            <button
              onClick={handleProgramarSorteo}
              className="ejecutar coral"
              disabled={cargando}
            >
              {cargando ? <ClipLoader size={20} color="#ffffff" /> : 'Programar sorteo'}
            </button>
          </>
        )}
      </div>
      {resultado && (
        <div className="sorteo-result">
          <h2>Resultado del Sorteo</h2>
          <p>ID: {resultado.sorteo_id} - Nombre: {resultado.nombre_sorteo}</p>
          {resultado.items && resultado.items.length > 0 ? (
            <ul>
              {resultado.items.map((itemObj, i) => (
                <li key={i}>
                  <strong>{itemObj.orden_item}° Premio:</strong> {itemObj.nombre_item}
                  <ul>
                    {itemObj.ganadores.map((ganador, j) => (
                      <li key={j}>
                        Ganador: {ganador.nombre} {ganador.apellido} ({ganador.email})
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p>Sin items en la respuesta.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Sorteo;
