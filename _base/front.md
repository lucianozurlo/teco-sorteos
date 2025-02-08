// sorteo-frontend/src/App.js

import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from './Header';
import Sorteo from './components/Sorteo';
import Premios from './components/Premios';
import Registro from './components/Registro';
import Bases from './components/Bases';
import ScheduledSorteos from './components/ScheduledSorteos';
import AdminRedirect from './components/AdminRedirect';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App () {
  return (
    <Router>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Sorteo />} />
          <Route path="/premios" element={<Premios />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/bases" element={<Bases />} />
          <Route path="/scheduled" element={<ScheduledSorteos />} />
          <Route path="/admin" element={<AdminRedirect />} />
        </Routes>
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;



// sorteo-frontend/src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import 'bootstrap/dist/css/bootstrap.min.css';

const container = document.getElementById ('root');
const root = ReactDOM.createRoot (container);

root.render (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals (console.log);



// sorteo-frontend/src/config.js;

// export const API_BASE_URL =
//   process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

export const API_BASE_URL = 'https://web-production-0252.up.railway.app';

export const ADMIN_URL =
  process.env.REACT_APP_ADMIN_URL || `${API_BASE_URL}/admin/`;



// sorteo-frontend/src/reportWebVitals.js

import {onCLS, onFID, onFCP, onLCP, onTTFB} from 'web-vitals';

const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS (onPerfEntry);
    onFID (onPerfEntry);
    onFCP (onPerfEntry);
    onLCP (onPerfEntry);
    onTTFB (onPerfEntry);
  }
};

export default reportWebVitals;



// sorteo-frontend/src/Header.js

import React from 'react';
import {NavLink} from 'react-router-dom';
import './Header.css';

function Header () {
  return (
    <header>
      <div className="header-inner">
        <div className="header-logo">Sorteos CI</div>
        <ul className="nav-links">
          <li><NavLink to="/">Sorteo</NavLink></li>
          <li><NavLink to="/premios">Premios</NavLink></li>
          <li><NavLink to="/registro">Registro</NavLink></li>
          <li><NavLink to="/bases">Bases</NavLink></li>
          <li><NavLink to="/scheduled">Sorteos Programados</NavLink></li>
          <li>
            <a href="/admin" target="_blank" rel="noopener noreferrer">
              Admin
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;



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

function Sorteo () {
  // Campos básicos
  const [nombreSorteo, setNombreSorteo] = useState ('');
  const [descripcion, setDescripcion] = useState ('');

  // Toggle para programar sorteo y fecha programada
  const [programarSorteo, setProgramarSorteo] = useState (false);
  const [scheduledDate, setScheduledDate] = useState ('');

  // Filtros opcionales
  const [usarFiltros, setUsarFiltros] = useState (false);
  const [provincias, setProvincias] = useState ([]);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState ('');
  const [localidades, setLocalidades] = useState ([]);
  const [localidadSeleccionada, setLocalidadSeleccionada] = useState ('');

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
        if (scheduled.fecha_programada) {
          const dt = new Date (scheduled.fecha_programada);
          const isoString = dt.toISOString ().slice (0, 16);
          setScheduledDate (isoString);
        }
        if (scheduled.sorteopremios && scheduled.sorteopremios.length > 0) {
          const premiosItems = scheduled.sorteopremios.map (sp => ({
            id: sp.premio.id,
            nombre_item: sp.premio.nombre,
            cantidad: sp.cantidad,
          }));
          setItems (premiosItems);
        }
        // Forzamos el toggle "Programar sorteo" a false para cargar los datos
        setProgramarSorteo (false);
        // Limpiar el state de la navegación para evitar recargas posteriores
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

  // eslint-disable-next-line no-unused-vars
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
    // En el payload incluimos provincia y localidad (aunque sean vacíos)
    const payload = {
      nombre: nombreSorteo,
      descripcion: descripcion,
      premios: premiosConOrden,
      provincia: provinciaSeleccionada || '',
      localidad: localidadSeleccionada || '',
    };
    if (programarSorteo) {
      if (!scheduledDate) {
        toast.error (
          'Por favor, ingresá la fecha y hora para programar el sorteo.'
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
          toast.success (data.message || 'Sorteo programado exitosamente.');
          setNombreSorteo ('');
          setDescripcion ('');
          setItems ([]);
          setScheduledDate ('');
        } else {
          toast.error (data.error || 'Error al programar el sorteo.');
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
      {/* Toggle de restricción */}
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
                <option key={idx} value={prov}>{prov}</option>
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
                <option key={idx} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>}
      <hr />
      {/* Toggle para programar sorteo */}
      <div className="sorteo-section">
        <label>
          <input
            type="checkbox"
            checked={programarSorteo}
            onChange={() => setProgramarSorteo (!programarSorteo)}
          />
          Programar sorteo
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
      {/* Lista de premios agregados */}
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
                : programarSorteo ? 'Programar sorteo' : 'Sortear'}
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



// sorteo-frontend/src/components/UploadCSV.js

import React, {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {toast} from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import {API_BASE_URL} from '../config';
import './UploadCSV.css';

function UploadCSV () {
  const [fileUsuarios, setFileUsuarios] = useState (null);
  const [fileListaNegra, setFileListaNegra] = useState (null);
  const [cargando, setCargando] = useState (false);

  const onDropUsuarios = useCallback (acceptedFiles => {
    const file = acceptedFiles[0];
    if (file && file.type === 'text/csv') {
      setFileUsuarios (file);
      toast.success (
        `Listado de participantes "${file.name}" cargado correctamente.`
      );
    } else {
      toast.error ('Por favor, subí un archivo CSV válido para participantes.');
    }
  }, []);

  const onDropListaNegra = useCallback (acceptedFiles => {
    const file = acceptedFiles[0];
    if (file && file.type === 'text/csv') {
      setFileListaNegra (file);
      toast.success (
        `Listado de participantes no incluidos "${file.name}" cargado correctamente.`
      );
    } else {
      toast.error ('Por favor, subí un archivo CSV válido.');
    }
  }, []);

  const {
    getRootProps: getRootPropsUsuarios,
    getInputProps: getInputPropsUsuarios,
    isDragActive: isDragActiveUsuarios,
  } = useDropzone ({onDrop: onDropUsuarios, accept: {'text/csv': ['.csv']}});

  const {
    getRootProps: getRootPropsListaNegra,
    getInputProps: getInputPropsListaNegra,
    isDragActive: isDragActiveListaNegra,
  } = useDropzone ({onDrop: onDropListaNegra, accept: {'text/csv': ['.csv']}});

  const handleUpload = async () => {
    if (!fileUsuarios && !fileListaNegra) {
      toast.error ('Por favor, arrastrá al menos un archivo.');
      return;
    }
    setCargando (true);
    try {
      const formData = new FormData ();
      if (fileUsuarios) {
        formData.append ('usuarios', fileUsuarios);
      }
      if (fileListaNegra) {
        formData.append ('lista_negra', fileListaNegra);
      }
      const response = await fetch (`${API_BASE_URL}/api/upload_csv/`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json ();
      if (response.ok) {
        toast.success (data.usuarios ? data.usuarios : data.lista_negra);
        setFileUsuarios (null);
        setFileListaNegra (null);
      } else {
        toast.error (data.error || 'Error al subir archivo CSV');
      }
    } catch (err) {
      console.error (err);
      toast.error ('Error al subir archivo CSV.');
    } finally {
      setCargando (false);
    }
  };

  return (
    <div className="upload-csv-container">
      <h4>Cargar archivos CSV</h4>
      <div className="dropzone-container">
        <div
          {...getRootPropsUsuarios ()}
          className={`dropzone ${isDragActiveUsuarios ? 'active' : ''}`}
        >
          <input {...getInputPropsUsuarios ()} />
          {fileUsuarios
            ? <p>{fileUsuarios.name}</p>
            : <p>
                Arrastrá el archivo CSV de participantes o hacé clic para seleccionarlo
              </p>}
        </div>
        <div
          {...getRootPropsListaNegra ()}
          className={`dropzone ${isDragActiveListaNegra ? 'active' : ''}`}
        >
          <input {...getInputPropsListaNegra ()} />
          {fileListaNegra
            ? <p>{fileListaNegra.name}</p>
            : <p>
                Arrastrá el archivo CSV de usuarios que no participarán de los sorteos o hacé clic para seleccionarlo
              </p>}
        </div>
      </div>
      <button onClick={handleUpload} className="ejecutar" disabled={cargando}>
        {cargando ? <ClipLoader size={20} color="#ffffff" /> : 'Subir CSV'}
      </button>
      <div className="descargar-plantillas" style={{marginTop: '1rem'}}>
        <h4>Descargar Plantillas de ejemplo</h4>
        <a
          href={`${API_BASE_URL}/api/download_template/participantes/`}
          download="participantes_template.csv"
          className="btn"
        >
          Participantes
        </a>
        <a
          href={`${API_BASE_URL}/api/download_template/lista_negra/`}
          download="lista_negra_template.csv"
          className="btn"
          style={{marginLeft: '1rem'}}
        >
          Participantes no incluidos
        </a>
      </div>
    </div>
  );
}

export default UploadCSV;



// sorteo-frontend/src/components/AddToBlacklist.js

import React, {useState} from 'react';
import {toast} from 'react-toastify';
import {API_BASE_URL} from '../config';
import './AddToBlacklist.css';

function AddToBlacklist({onUpdate}) {
  const [participantId, setParticipantId] = useState ('');

  const handleAdd = async () => {
    if (!participantId) {
      toast.error ('Por favor, ingresá un legajo.');
      return;
    }
    try {
      const response = await fetch (`${API_BASE_URL}/api/blacklist/add/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify ({id: participantId}),
      });
      const data = await response.json ();
      if (response.ok) {
        toast.success (data.message);
        setParticipantId ('');
        if (onUpdate) onUpdate ();
      } else {
        toast.error (data.error || 'Error al agregar a la lista.');
      }
    } catch (err) {
      console.error (err);
      toast.error ('Error al agregar a la lista.');
    }
  };

  return (
    <div className="add-to-blacklist-container">
      <h4>Participantes no incluidos</h4>
      <input
        type="number"
        value={participantId}
        onChange={e => setParticipantId (e.target.value)}
        placeholder="Legajo del participante"
      />
      <button onClick={handleAdd}>Agregar</button>
    </div>
  );
}

export default AddToBlacklist;



// sorteo-frontend/src/components/AdminRedirect.js

import React, {useEffect} from 'react';
import {ADMIN_URL} from '../config';

const AdminRedirect = () => {
  useEffect (() => {
    // Abre la URL en una nueva ventana
    window.open (ADMIN_URL, '_blank', 'noopener,noreferrer');
  }, []);

  return (
    <div>
      Redirigiendo...
    </div>
  );
};

export default AdminRedirect;



// sorteo-frontend/src/components/AddToParticipants.js

import React, {useState} from 'react';
import {toast} from 'react-toastify';
import {API_BASE_URL} from '../config';
import './AddToParticipants.css';

function AddToParticipants({onUpdate}) {
  const [legajo, setLegajo] = useState ('');
  const [nombre, setNombre] = useState ('');
  const [apellido, setApellido] = useState ('');
  const [email, setEmail] = useState ('');
  const [area, setArea] = useState ('');
  const [dominio, setDominio] = useState ('');
  const [cargo, setCargo] = useState ('');
  const [localidad, setLocalidad] = useState ('');
  const [provincia, setProvincia] = useState ('');

  const handleAdd = async () => {
    if (!legajo || !nombre.trim () || !apellido.trim () || !email.trim ()) {
      toast.error ('Por favor, completá todos los campos obligatorios (*)');
      return;
    }
    const payload = {
      id: legajo,
      nombre: nombre.trim (),
      apellido: apellido.trim (),
      email: email.trim (),
      area: area.trim (),
      dominio: dominio.trim (),
      cargo: cargo.trim (),
      localidad: localidad.trim (),
      provincia: provincia.trim (),
    };

    try {
      const response = await fetch (`${API_BASE_URL}/api/participants/add/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify (payload),
      });
      const data = await response.json ();
      if (response.ok) {
        toast.success (data.message);
        // Limpiar el formulario
        setLegajo ('');
        setNombre ('');
        setApellido ('');
        setEmail ('');
        setArea ('');
        setDominio ('');
        setCargo ('');
        setLocalidad ('');
        setProvincia ('');
        if (onUpdate) onUpdate ();
      } else {
        toast.error (data.error || 'Error al agregar participante.');
      }
    } catch (err) {
      console.error (err);
      toast.error ('Error al agregar participante.');
    }
  };

  return (
    <div className="add-to-participants-container">
      <h4>Agregar Participante</h4>

      <div className="input-row">
        <div className="form-group">
          <label>Legajo *:</label>
          <input
            type="number"
            value={legajo}
            onChange={e => setLegajo (e.target.value)}
            placeholder="Legajo"
          />
        </div>
        <div className="form-group">
          <label>Nombre *:</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre (e.target.value)}
            placeholder="Nombre"
          />
        </div>
        <div className="form-group">
          <label>Apellido *:</label>
          <input
            type="text"
            value={apellido}
            onChange={e => setApellido (e.target.value)}
            placeholder="Apellido"
          />
        </div>
      </div>

      <div className="input-row">
        <div className="form-group">
          <label>Área:</label>
          <input
            type="text"
            value={area}
            onChange={e => setArea (e.target.value)}
            placeholder="Área"
          />
        </div>
        <div className="form-group">
          <label>Dominio:</label>
          <input
            type="text"
            value={dominio}
            onChange={e => setDominio (e.target.value)}
            placeholder="Dominio"
          />
        </div>
      </div>

      <div className="input-row">
        <div className="form-group">
          <label>Cargo:</label>
          <input
            type="text"
            value={cargo}
            onChange={e => setCargo (e.target.value)}
            placeholder="Cargo"
          />
        </div>
        <div className="form-group">
          <label>Email *:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail (e.target.value)}
            placeholder="Email"
          />
        </div>
      </div>

      <div className="input-row">
        <div className="form-group">
          <label>Localidad:</label>
          <input
            type="text"
            value={localidad}
            onChange={e => setLocalidad (e.target.value)}
            placeholder="Localidad"
          />
        </div>
        <div className="form-group">
          <label>Provincia:</label>
          <input
            type="text"
            value={provincia}
            onChange={e => setProvincia (e.target.value)}
            placeholder="Provincia"
          />
        </div>
      </div>

      <div className="input-row">
        <button onClick={handleAdd}>Agregar Participante</button>
        <p className="mandatory-note">(*) Campos obligatorios</p>
      </div>
    </div>
  );
}

export default AddToParticipants;



// sorteo-frontend/src/components/Bases.js

import React, {useState, useEffect} from 'react';
import {toast} from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import {API_BASE_URL} from '../config';
import UploadCSV from './UploadCSV';
import AddToBlacklist from './AddToBlacklist';
import AddToParticipants from './AddToParticipants';
import './Bases.css';

function Bases () {
  const [activeTab, setActiveTab] = useState ('participantes');
  const [data, setData] = useState ({participantes: [], blacklist: []});
  const [loading, setLoading] = useState (false);
  // Para manejo de edición inline
  const [editRow, setEditRow] = useState (null);
  const [editValues, setEditValues] = useState ({});

  const fetchLists = async () => {
    setLoading (true);
    try {
      const response = await fetch (`${API_BASE_URL}/api/lists/`);
      const jsonData = await response.json ();
      setData (jsonData);
    } catch (error) {
      console.error (error);
      toast.error ('Error al obtener las bases.');
    } finally {
      setLoading (false);
    }
  };

  useEffect (() => {
    fetchLists ();
  }, []);

  // Funciones para vaciar listas
  const clearParticipants = async () => {
    if (!window.confirm ('¿Estás seguro de vaciar la lista de participantes?'))
      return;
    try {
      const response = await fetch (
        `${API_BASE_URL}/api/lists/clear/participantes/`,
        {
          method: 'DELETE',
        }
      );
      const dataResp = await response.json ();
      if (response.ok) {
        toast.info (dataResp.message || 'Lista de participantes vaciada.');
        fetchLists ();
      } else {
        toast.error (
          dataResp.error || 'Error al vaciar la lista de participantes.'
        );
      }
    } catch (err) {
      console.error (err);
      toast.error ('Error de conexión.');
    }
  };

  const clearBlacklist = async () => {
    if (!window.confirm ('¿Estás seguro de vaciar la lista de no incluidos?'))
      return;
    try {
      const response = await fetch (
        `${API_BASE_URL}/api/lists/clear/blacklist/`,
        {
          method: 'DELETE',
        }
      );
      const dataResp = await response.json ();
      if (response.ok) {
        toast.info (dataResp.message || 'Lista de no incluidos vaciada.');
        fetchLists ();
      } else {
        toast.error (
          dataResp.error || 'Error al vaciar la lista de no incluidos.'
        );
      }
    } catch (err) {
      console.error (err);
      toast.error ('Error de conexión.');
    }
  };

  // Manejo del modo edición inline
  const startEditing = item => {
    setEditRow (item.id);
    setEditValues ({...item});
  };

  const cancelEditing = () => {
    setEditRow (null);
    setEditValues ({});
  };

  const saveEditing = async id => {
    const payload = {...editValues, id};
    try {
      let url = activeTab === 'participantes'
        ? `${API_BASE_URL}/api/participants/add/`
        : `${API_BASE_URL}/api/blacklist/add/`;
      const response = await fetch (url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify (payload),
      });
      const dataResp = await response.json ();
      if (response.ok) {
        toast.success (dataResp.message);
        cancelEditing ();
        fetchLists ();
      } else {
        toast.error (dataResp.error || 'Error al actualizar el registro.');
      }
    } catch (err) {
      console.error (err);
      toast.error ('Error de conexión.');
    }
  };

  // Renderizado para filas en la lista de participantes
  const renderRow = item => {
    if (editRow === item.id) {
      return (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>
            <input
              type="text"
              value={editValues.nombre || ''}
              onChange={e =>
                setEditValues ({...editValues, nombre: e.target.value})}
            />
          </td>
          <td>
            <input
              type="text"
              value={editValues.apellido || ''}
              onChange={e =>
                setEditValues ({...editValues, apellido: e.target.value})}
            />
          </td>
          <td>
            <input
              type="text"
              value={editValues.area || ''}
              onChange={e =>
                setEditValues ({...editValues, area: e.target.value})}
            />
          </td>
          <td>
            <input
              type="text"
              value={editValues.dominio || ''}
              onChange={e =>
                setEditValues ({...editValues, dominio: e.target.value})}
            />
          </td>
          <td>
            <input
              type="text"
              value={editValues.cargo || ''}
              onChange={e =>
                setEditValues ({...editValues, cargo: e.target.value})}
            />
          </td>
          <td>
            <input
              type="email"
              value={editValues.email || ''}
              onChange={e =>
                setEditValues ({...editValues, email: e.target.value})}
            />
          </td>
          <td>
            <input
              type="text"
              value={editValues.localidad || ''}
              onChange={e =>
                setEditValues ({...editValues, localidad: e.target.value})}
            />
          </td>
          <td>
            <input
              type="text"
              value={editValues.provincia || ''}
              onChange={e =>
                setEditValues ({...editValues, provincia: e.target.value})}
            />
          </td>
          <td>
            <div className="acciones edit">
              <button onClick={() => saveEditing (item.id)} title="Guardar">
                Guardar
              </button>
              <button onClick={cancelEditing} className="rojo" title="Cancelar">
                Cancelar
              </button>
            </div>
          </td>
        </tr>
      );
    }
    return (
      <tr key={item.id}>
        <td>{item.id}</td>
        <td>{item.nombre}</td>
        <td>{item.apellido}</td>
        <td>{item.area}</td>
        <td>{item.dominio}</td>
        <td>{item.cargo}</td>
        <td>{item.email}</td>
        <td>{item.localidad}</td>
        <td>{item.provincia}</td>
        <td>
          <div className="acciones">
            <button
              className="azul"
              onClick={() => startEditing (item)}
              style={{backgroundColor: 'transparent', border: 'none'}}
              title="Editar"
            >
              {/* SVG de edición */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                style={{width: '16px', height: '16px', fill: 'white'}}
              >
                <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
              </svg>
            </button>
            {/* En la lista de participantes no se muestra el botón de "mover a participantes" */}
            <button
              className="rojo"
              onClick={async () => {
                try {
                  const response = await fetch (
                    `${API_BASE_URL}/api/blacklist/add/`,
                    {
                      method: 'POST',
                      headers: {'Content-Type': 'application/json'},
                      body: JSON.stringify ({id: item.id}),
                    }
                  );
                  const dataResp = await response.json ();
                  if (response.ok) {
                    toast.success (dataResp.message);
                    fetchLists ();
                  } else {
                    toast.error (
                      dataResp.error || 'Error al mover el registro.'
                    );
                  }
                } catch (err) {
                  console.error (err);
                  toast.error ('Error de conexión.');
                }
              }}
              style={{backgroundColor: 'transparent', border: 'none'}}
              title="Mover a No incluidos"
            >
              {/* SVG para mover de participantes a no incluidos */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
                style={{width: '16px', height: '16px', fill: 'white'}}
              >
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
              </svg>
            </button>
          </div>
        </td>
      </tr>
    );
  };

  // Renderizado para la lista de no incluidos: aquí no se muestra el botón de "Mover a No incluidos"
  const renderBlacklistRow = item => {
    if (editRow === item.id) {
      return (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>
            <input
              type="text"
              value={editValues.nombre || ''}
              onChange={e =>
                setEditValues ({...editValues, nombre: e.target.value})}
            />
          </td>
          <td>
            <input
              type="text"
              value={editValues.apellido || ''}
              onChange={e =>
                setEditValues ({...editValues, apellido: e.target.value})}
            />
          </td>
          <td>
            <input
              type="text"
              value={editValues.area || ''}
              onChange={e =>
                setEditValues ({...editValues, area: e.target.value})}
            />
          </td>
          <td>
            <input
              type="text"
              value={editValues.dominio || ''}
              onChange={e =>
                setEditValues ({...editValues, dominio: e.target.value})}
            />
          </td>
          <td>
            <input
              type="text"
              value={editValues.cargo || ''}
              onChange={e =>
                setEditValues ({...editValues, cargo: e.target.value})}
            />
          </td>
          <td>
            <input
              type="email"
              value={editValues.email || ''}
              onChange={e =>
                setEditValues ({...editValues, email: e.target.value})}
            />
          </td>
          <td>
            <input
              type="text"
              value={editValues.localidad || ''}
              onChange={e =>
                setEditValues ({...editValues, localidad: e.target.value})}
            />
          </td>
          <td>
            <input
              type="text"
              value={editValues.provincia || ''}
              onChange={e =>
                setEditValues ({...editValues, provincia: e.target.value})}
            />
          </td>
          <td>
            <div className="acciones edit">
              <button onClick={() => saveEditing (item.id)} title="Guardar">
                Guardar
              </button>
              <button onClick={cancelEditing} className="rojo" title="Cancelar">
                Cancelar
              </button>
            </div>
          </td>
        </tr>
      );
    }
    return (
      <tr key={item.id}>
        <td>{item.id}</td>
        <td>{item.nombre}</td>
        <td>{item.apellido}</td>
        <td>{item.area}</td>
        <td>{item.dominio}</td>
        <td>{item.cargo}</td>
        <td>{item.email}</td>
        <td>{item.localidad}</td>
        <td>{item.provincia}</td>
        <td>
          <div className="acciones">
            <button
              className="azul"
              onClick={() => startEditing (item)}
              style={{backgroundColor: 'transparent', border: 'none'}}
              title="Editar"
            >
              {/* SVG de edición */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                style={{width: '16px', height: '16px', fill: 'white'}}
              >
                <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
              </svg>
            </button>
            {/* En la lista de no incluidos no se muestra el botón "Mover a No incluidos" */}
            <button
              className="verde"
              onClick={async () => {
                try {
                  const payload = {
                    id: item.id,
                    nombre: item.nombre,
                    apellido: item.apellido,
                    email: item.email,
                    area: item.area,
                    dominio: item.dominio,
                    cargo: item.cargo,
                    localidad: item.localidad,
                    provincia: item.provincia,
                  };
                  const response = await fetch (
                    `${API_BASE_URL}/api/participants/add/`,
                    {
                      method: 'POST',
                      headers: {'Content-Type': 'application/json'},
                      body: JSON.stringify (payload),
                    }
                  );
                  const dataResp = await response.json ();
                  if (response.ok) {
                    toast.success (dataResp.message);
                    fetchLists ();
                  } else {
                    toast.error (
                      dataResp.error || 'Error al mover el registro.'
                    );
                  }
                } catch (err) {
                  console.error (err);
                  toast.error ('Error de conexión.');
                }
              }}
              style={{backgroundColor: 'transparent', border: 'none'}}
              title="Mover a Participantes"
            >
              {/* SVG para mover de no incluidos a participantes */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                style={{width: '16px', height: '16px', fill: 'white'}}
              >
                <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
              </svg>
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bases-container">
      <h2>Bases</h2>
      <div className="tabs">
        <button
          className={activeTab === 'participantes' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab ('participantes')}
        >
          Listado participantes
        </button>
        <button
          className={activeTab === 'no_incluidos' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab ('no_incluidos')}
        >
          Listado No incluidos
        </button>
        <button
          className={activeTab === 'cargar' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab ('cargar')}
        >
          Cargar bases
        </button>
      </div>

      {activeTab === 'participantes' &&
        <div className="list-section">
          <div className="clear-button-container">
            <button className="clear-button" onClick={clearParticipants}>
              Vaciar lista
            </button>
          </div>
          {loading
            ? <ClipLoader size={50} color="#123abc" />
            : data.participantes && data.participantes.length > 0
                ? <table className="table">
                    <thead>
                      <tr>
                        <th>Legajo</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Área</th>
                        <th>Dominio</th>
                        <th>Cargo</th>
                        <th>Email</th>
                        <th>Localidad</th>
                        <th>Provincia</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.participantes.map (
                        item =>
                          editRow === item.id
                            ? renderRow (item)
                            : renderRow (item)
                      )}
                    </tbody>
                  </table>
                : <p>No se encontraron registros de participantes.</p>}
        </div>}

      {activeTab === 'no_incluidos' &&
        <div className="list-section">
          <div className="clear-button-container">
            <button className="clear-button" onClick={clearBlacklist}>
              Vaciar lista
            </button>
          </div>
          {loading
            ? <ClipLoader size={50} color="#123abc" />
            : data.blacklist && data.blacklist.length > 0
                ? <table className="table">
                    <thead>
                      <tr>
                        <th>Legajo</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Área</th>
                        <th>Dominio</th>
                        <th>Cargo</th>
                        <th>Email</th>
                        <th>Localidad</th>
                        <th>Provincia</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.blacklist.map (
                        item =>
                          editRow === item.id
                            ? renderBlacklistRow (item)
                            : renderBlacklistRow (item)
                      )}
                    </tbody>
                  </table>
                : <p>
                    No se encontraron registros en la lista de No incluidos.
                  </p>}
        </div>}

      {activeTab === 'cargar' &&
        <div className="cargar-section">
          <div className="cargar-item">
            <h3>Cargar base de participantes</h3>
            <UploadCSV onUpdate={fetchLists} />
          </div>
          <div className="cargar-item">
            <h3>Agregar en forma individual</h3>
            <AddToParticipants onUpdate={fetchLists} />
            <AddToBlacklist onUpdate={fetchLists} />
          </div>
        </div>}
    </div>
  );
}

export default Bases;



// sorteo-frontend/src/components/Premios.js

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import './Premios.css';
import { API_BASE_URL } from '../config';

function Premios() {
  const [premios, setPremios] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoStock, setNuevoStock] = useState(1);
  const [editPremioId, setEditPremioId] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editStock, setEditStock] = useState(1);
  const [cargando, setCargando] = useState(false);

  const fetchPremios = async () => {
    setCargando(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/premios/`);
      if (!response.ok) {
        throw new Error('Error al obtener los premios');
      }
      const data = await response.json();
      setPremios(data);
    } catch (error) {
      console.error('Error al obtener los premios:', error);
      toast.error('Error al obtener los premios.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchPremios();
  }, []);

  const agregarPremio = async () => {
    if (!nuevoNombre.trim()) {
      toast.error('Por favor, ingresá un nombre para el premio.');
      return;
    }
    if (nuevoStock < 1) {
      toast.error('Debe haber por lo menos 1 elemento en stock.');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/premios/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nuevoNombre, stock: nuevoStock }),
      });
      if (response.ok) {
        const nuevoPremio = await response.json();
        setPremios([...premios, nuevoPremio]);
        setNuevoNombre('');
        setNuevoStock(1);
        toast.success(`Premio "${nuevoPremio.nombre}" agregado exitosamente.`);
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || 'Error al agregar el premio.');
      }
    } catch (error) {
      console.error('Error al agregar el premio:', error);
      toast.error('Error al agregar el premio.');
    }
  };

  const iniciarEdicion = (premio) => {
    setEditPremioId(premio.id);
    setEditNombre(premio.nombre);
    setEditStock(premio.stock);
  };

  const cancelarEdicion = () => {
    setEditPremioId(null);
    setEditNombre('');
    setEditStock(1);
  };

  const guardarEdicion = async () => {
    if (!editNombre.trim()) {
      toast.error('Por favor, ingresá un nombre para el premio.');
      return;
    }
    if (editStock < 0) {
      toast.error('El stock no puede ser negativo.');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/premios/${editPremioId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: editNombre, stock: editStock }),
      });
      if (response.ok) {
        const updatedPremio = await response.json();
        setPremios(premios.map(p => p.id === editPremioId ? updatedPremio : p));
        cancelarEdicion();
        toast.success(`Premio "${updatedPremio.nombre}" actualizado exitosamente.`);
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || 'Error al actualizar el premio.');
      }
    } catch (error) {
      console.error('Error al actualizar el premio:', error);
      toast.error('Error al actualizar el premio.');
    }
  };

  const eliminarPremio = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este premio?')) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/premios/${id}/`, {
        method: 'DELETE',
      });
      if (response.status === 204) {
        setPremios(premios.filter(p => p.id !== id));
        toast.info('Premio eliminado exitosamente.');
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || 'Error al eliminar el premio.');
      }
    } catch (error) {
      console.error('Error al eliminar el premio:', error);
      toast.error('Error al eliminar el premio.');
    }
  };

  return (
    <div className="premios-container">
      <h2>Premios</h2>
      <div className="premios-section">
        <h3>Agregar Nuevo Premio</h3>
        <input
          type="text"
          placeholder="Nombre del premio"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
        />
        <input
          type="number"
          placeholder="Stock"
          value={nuevoStock}
          onChange={(e) => setNuevoStock(Number(e.target.value))}
          min="1"
        />
        <button onClick={agregarPremio}>Agregar Premio</button>
      </div>
      <hr />
      <div className="premios-section">
        <h3>Lista de Premios</h3>
        {cargando ? (
          <ClipLoader size={50} color="#123abc" />
        ) : (
          <table className="premios-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {premios.map(premio => (
                <tr key={premio.id}>
                  <td>
                    {editPremioId === premio.id ? (
                      <input
                        type="text"
                        value={editNombre}
                        onChange={(e) => setEditNombre(e.target.value)}
                      />
                    ) : (
                      premio.nombre
                    )}
                  </td>
                  <td>
                    {editPremioId === premio.id ? (
                      <input
                        type="number"
                        value={editStock}
                        onChange={(e) => setEditStock(Number(e.target.value))}
                        min="0"
                      />
                    ) : (
                      premio.stock
                    )}
                  </td>
                  <td>
                    {editPremioId === premio.id ? (
                      <>
                      <div className="acciones edit">
                        <button onClick={guardarEdicion}>Guardar</button>
                        <button onClick={cancelarEdicion} className="rojo">Cancelar</button>
                      </div>
                      </>
                    ) : (
                      <>
                      <div className="acciones">
                        <button onClick={() => iniciarEdicion(premio)} className="azul">
                        <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                style={{width: '16px', height: '16px', fill: 'white', marginRight: '7px'}}
              >
                <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
              </svg>
                          Editar
                          </button>
                        <button onClick={() => eliminarPremio(premio.id)} className="rojo">
                        <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
                style={{width: '16px', height: '16px', fill: 'white', marginRight: '7px'}}
              >
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
              </svg>
                          Eliminar
                          </button>
                      </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Premios;


// sorteo-frontend/src/components/Registro.js

import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import { API_BASE_URL } from '../config';
import './Registro.css';

function Registro() {
  // Estados para "Resultados de Sorteos"
  const [resultados, setResultados] = useState([]);
  const [cargandoResultados, setCargandoResultados] = useState(false);

  // Estados para "Sorteos Realizados"
  const [sorteos, setSorteos] = useState([]);
  const [cargandoSorteos, setCargandoSorteos] = useState(false);

  // Estado para "Registro de Actividades"
  const [actividad, setActividad] = useState([]);
  const [cargandoActividad, setCargandoActividad] = useState(false);

  // Sorting y filtrado para Resultados de Sorteos
  const [sortConfig, setSortConfig] = useState({ key: 'fecha', direction: 'desc' });
  const [filtroSorteo, setFiltroSorteo] = useState('');
  const [filtroParticipante, setFiltroParticipante] = useState('');
  const [filtroPremio, setFiltroPremio] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');

  // Sorting y filtrado para Sorteos Realizados
  const [filtroSorteoNombre, setFiltroSorteoNombre] = useState('');
  const [filtroSorteoDescripcion, setFiltroSorteoDescripcion] = useState('');
  const [filtroSorteoFecha, setFiltroSorteoFecha] = useState('');
  const [sortConfigSorteo, setSortConfigSorteo] = useState({ key: 'fecha_hora', direction: 'desc' });

  // Opciones de filtro para Resultados y Sorteos Realizados
  const [opcionesSorteo, setOpcionesSorteo] = useState([]);
  const [opcionesParticipante, setOpcionesParticipante] = useState([]);
  const [opcionesPremio, setOpcionesPremio] = useState([]);
  const [opcionesFecha, setOpcionesFecha] = useState([]);
  const [opcionesSorteoNombre, setOpcionesSorteoNombre] = useState([]);
  const [opcionesSorteoFecha, setOpcionesSorteoFecha] = useState([]);

  // Funciones para obtener datos
  const fetchResultados = async () => {
    setCargandoResultados(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/resultados_sorteo/`);
      const data = await response.json();
      // Ordenar de más nuevo a más viejo según "fecha"
      const resultadosOrdenados = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setResultados(resultadosOrdenados);
    } catch (error) {
      console.error('Error al obtener resultados:', error);
      toast.error('Error al obtener resultados.');
    } finally {
      setCargandoResultados(false);
    }
  };

  const fetchSorteos = async () => {
    setCargandoSorteos(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/sorteos/`);
      const data = await response.json();
      // Ordenar de más nuevo a más viejo según "fecha_hora"
      const sorteosOrdenados = data.sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora));
      setSorteos(sorteosOrdenados);
    } catch (error) {
      console.error('Error al obtener sorteos:', error);
      toast.error('Error al obtener sorteos.');
    } finally {
      setCargandoSorteos(false);
    }
  };

  const fetchActividad = async () => {
    setCargandoActividad(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/registro_actividad/`);
      const data = await response.json();
      setActividad(data);
    } catch (error) {
      console.error('Error al obtener actividad:', error);
      toast.error('Error al obtener actividad.');
    } finally {
      setCargandoActividad(false);
    }
  };

  useEffect(() => {
    fetchResultados();
    fetchSorteos();
    fetchActividad();
  }, []);

  // Opciones de filtro para "Resultados de Sorteos"
  useEffect(() => {
    const nombresSorteo = Array.from(
      new Set(resultados.map(r => (r.sorteo && r.sorteo.nombre) || ''))
    ).filter(Boolean);
    setOpcionesSorteo(nombresSorteo);

    const nombresParticipante = Array.from(
      new Set(
        resultados
          .map(r => (r.participante ? `${r.participante.nombre} ${r.participante.apellido}` : ''))
          .filter(Boolean)
      )
    );
    setOpcionesParticipante(nombresParticipante);

    const nombresPremio = Array.from(
      new Set(resultados.map(r => (r.premio && r.premio.nombre) || '').filter(Boolean))
    );
    setOpcionesPremio(nombresPremio);

    const fechasUnicas = Array.from(
      new Set(
        resultados
          .map(r => {
            const d = new Date(r.fecha);
            return `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}`;
          })
          .filter(Boolean)
      )
    );
    setOpcionesFecha(fechasUnicas);
  }, [resultados]);

  // Opciones de filtro para "Sorteos Realizados"
  useEffect(() => {
    const nombres = Array.from(new Set(sorteos.map(s => s.nombre).filter(Boolean)));
    setOpcionesSorteoNombre(nombres);

    const fechas = Array.from(
      new Set(
        sorteos
          .map(s => {
            const d = new Date(s.fecha_hora);
            return `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}`;
          })
          .filter(Boolean)
      )
    );
    setOpcionesSorteoFecha(fechas);
  }, [sorteos]);

  // Función para ordenar Resultados de Sorteos
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Variable ordenada para Resultados de Sorteos
  const sortedResultados = useMemo(() => {
    let sortableItems = [...resultados];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aVal, bVal;
        switch (sortConfig.key) {
          case 'id':
            aVal = a.id;
            bVal = b.id;
            break;
          case 'sorteo':
            aVal = a.sorteo?.nombre || '';
            bVal = b.sorteo?.nombre || '';
            break;
          case 'participante':
            aVal = a.participante ? `${a.participante.nombre} ${a.participante.apellido}` : '';
            bVal = b.participante ? `${b.participante.nombre} ${b.participante.apellido}` : '';
            break;
          case 'premio':
            aVal = a.premio?.nombre || '';
            bVal = b.premio?.nombre || '';
            break;
          case 'fecha':
            aVal = new Date(a.fecha);
            bVal = new Date(b.fecha);
            break;
          default:
            return 0;
        }
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [resultados, sortConfig]);

  // Función para ordenar Sorteos Realizados
  const requestSortSorteo = (key) => {
    let direction = 'asc';
    if (sortConfigSorteo.key === key && sortConfigSorteo.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfigSorteo({ key, direction });
  };

  const sortedSorteos = useMemo(() => {
    let sortableItems = [...sorteos.filter(s => {
      const matchNombre = filtroSorteoNombre ? s.nombre === filtroSorteoNombre : true;
      const matchDescripcion = filtroSorteoDescripcion
        ? s.descripcion.toLowerCase().includes(filtroSorteoDescripcion.toLowerCase())
        : true;
      const d = new Date(s.fecha_hora);
      const fechaFormateada = `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}`;
      const matchFecha = filtroSorteoFecha ? fechaFormateada === filtroSorteoFecha : true;
      return matchNombre && matchDescripcion && matchFecha;
    })];
    if (sortConfigSorteo !== null) {
      sortableItems.sort((a, b) => {
        let aVal, bVal;
        switch (sortConfigSorteo.key) {
          case 'id':
            aVal = a.id;
            bVal = b.id;
            break;
          case 'nombre':
            aVal = a.nombre || '';
            bVal = b.nombre || '';
            break;
          case 'descripcion':
            aVal = a.descripcion || '';
            bVal = b.descripcion || '';
            break;
          case 'fecha_hora':
            aVal = new Date(a.fecha_hora);
            bVal = new Date(b.fecha_hora);
            break;
          default:
            return 0;
        }
        if (aVal < bVal) return sortConfigSorteo.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfigSorteo.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [sorteos, filtroSorteoNombre, filtroSorteoDescripcion, filtroSorteoFecha, sortConfigSorteo]);

  const clearFilters = () => {
    setFiltroSorteo('');
    setFiltroParticipante('');
    setFiltroPremio('');
    setFiltroFecha('');
  };

  const clearSorteoFilters = () => {
    setFiltroSorteoNombre('');
    setFiltroSorteoDescripcion('');
    setFiltroSorteoFecha('');
  };

  return (
    <div className="registro-container">
      <h2>Registro de Sorteos y Actividades</h2>

      <h3>Resultados de Sorteos</h3>
      <div className="registro-section">
        {cargandoResultados ? (
          <ClipLoader size={50} color="#123abc" />
        ) : (
          <table className="registro-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('id')} style={{ cursor: 'pointer' }}>
                  ID {sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => requestSort('sorteo')} style={{ cursor: 'pointer' }}>
                  Sorteo {sortConfig.key === 'sorteo' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => requestSort('participante')} style={{ cursor: 'pointer' }}>
                  Participante {sortConfig.key === 'participante' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => requestSort('premio')} style={{ cursor: 'pointer' }}>
                  Premio {sortConfig.key === 'premio' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => requestSort('fecha')} style={{ cursor: 'pointer' }}>
                  Fecha {sortConfig.key === 'fecha' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedResultados.map((resultado) => (
                <tr key={resultado.id}>
                  <td>{resultado.id}</td>
                  <td>{resultado.sorteo && resultado.sorteo.nombre ? resultado.sorteo.nombre : 'Sin nombre'}</td>
                  <td>
                    {(resultado.participante && resultado.participante.nombre) || 'Sin participante'}{' '}
                    {(resultado.participante && resultado.participante.apellido) || ''}
                  </td>
                  <td>{resultado.premio && resultado.premio.nombre ? resultado.premio.nombre : 'Sin premio'}</td>
                  <td>{new Date(resultado.fecha).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <hr />

      <h3>Lista de Sorteos Realizados</h3>
      <div className="filtros-container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
        <div className="filtro">
          <label>Nombre:</label>
          <select value={filtroSorteoNombre} onChange={(e) => setFiltroSorteoNombre(e.target.value)}>
            <option value="">Todos</option>
            {opcionesSorteoNombre.map((nombre, idx) => (
              <option key={idx} value={nombre}>{nombre}</option>
            ))}
          </select>
        </div>
        <div className="filtro">
          <label>Descripción:</label>
          <input
            type="text"
            value={filtroSorteoDescripcion}
            onChange={(e) => setFiltroSorteoDescripcion(e.target.value)}
            placeholder="Buscar descripción..."
          />
        </div>
        <div className="filtro">
          <label>Fecha:</label>
          <select value={filtroSorteoFecha} onChange={(e) => setFiltroSorteoFecha(e.target.value)}>
            <option value="">Todas</option>
            {opcionesSorteoFecha.map((fecha, idx) => (
              <option key={idx} value={fecha}>{fecha}</option>
            ))}
          </select>
        </div>
        <div className="filtro">
          <button onClick={clearSorteoFilters}>Eliminar Filtros</button>
        </div>
      </div>
      <div className="registro-section">
        {cargandoSorteos ? (
          <ClipLoader size={50} color="#123abc" />
        ) : sorteos.length > 0 ? (
          <table className="registro-table">
            <thead>
              <tr>
                <th onClick={() => requestSortSorteo('id')} style={{ cursor: 'pointer' }}>
                  ID {sortConfigSorteo.key === 'id' ? (sortConfigSorteo.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => requestSortSorteo('nombre')} style={{ cursor: 'pointer' }}>
                  Nombre {sortConfigSorteo.key === 'nombre' ? (sortConfigSorteo.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => requestSortSorteo('descripcion')} style={{ cursor: 'pointer' }}>
                  Descripción {sortConfigSorteo.key === 'descripcion' ? (sortConfigSorteo.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => requestSortSorteo('fecha_hora')} style={{ cursor: 'pointer' }}>
                  Fecha y Hora {sortConfigSorteo.key === 'fecha_hora' ? (sortConfigSorteo.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th>Fecha Programada</th>
                <th>Provincia</th>
                <th>Localidad</th>
                <th>Premios</th>
              </tr>
            </thead>
            <tbody>
              {sortedSorteos.map((sorteo) => (
                <tr key={sorteo.id}>
                  <td>{sorteo.id}</td>
                  <td>{sorteo.nombre || 'Sin nombre'}</td>
                  <td>{sorteo.descripcion || '-'}</td>
                  <td>{new Date(sorteo.fecha_hora).toLocaleString()}</td>
                  <td>{sorteo.fecha_programada ? new Date(sorteo.fecha_programada).toLocaleString() : ''}</td>
                  <td>{sorteo.provincia || '-'}</td>
                  <td>{sorteo.localidad || '-'}</td>
                  <td>
                    {sorteo.premios && sorteo.premios.length > 0
                      ? sorteo.premios
                          .map(p => `${p.premio.nombre} (x${p.cantidad})`)
                          .join(', ')
                      : 'Sin premios'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No se encontraron registros de sorteos.</p>
        )}
      </div>

      <hr />

      <h3>Registro de Actividades</h3>
      <div className="registro-section">
        {cargandoActividad ? (
          <ClipLoader size={50} color="#123abc" />
        ) : (
          <ul className="actividad-list">
            {actividad.map(act => (
              <li key={act.id}>
                {new Date(act.fecha_hora).toLocaleString()} - {act.evento}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Registro;




// sorteo-frontend/src/components/ScheduledSorteos.js

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import { useNavigate } from 'react-router-dom';
import './ScheduledSorteos.css';
import { API_BASE_URL } from '../config';

function ScheduledSorteos() {
  const [sorteosProgramados, setSorteosProgramados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchScheduledSorteos();
  }, []);

  const fetchScheduledSorteos = async () => {
    setCargando(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/scheduled/`);
      const data = await response.json();
      setSorteosProgramados(data);
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar sorteos programados.');
    } finally {
      setCargando(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este sorteo programado?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/scheduled/${id}/`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast.info('Sorteo programado eliminado.');
        fetchScheduledSorteos();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Error al eliminar el sorteo programado.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error de conexión al eliminar el sorteo programado.');
    }
  };

  const startEditing = (sorteo) => {
    setEditingId(sorteo.id);
    setEditValues({ ...sorteo });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleSave = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/scheduled/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editValues),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Sorteo programado actualizado.');
        cancelEditing();
        fetchScheduledSorteos();
      } else {
        toast.error(data.error || 'Error al actualizar el sorteo programado.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error de conexión al actualizar el sorteo programado.');
    }
  };

  // Función que redirige al usuario a la página de Sorteo, pasando el sorteo programado
  const handlePlay = (sorteo) => {
    navigate('/', { state: { scheduledSorteo: sorteo } });
  };

  return (
    <div className="scheduled-container">
      <h2>Sorteos agendados</h2>
      {cargando ? (
        <ClipLoader size={50} color="#123abc" />
      ) : sorteosProgramados.length > 0 ? (
        <table className="scheduled-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Fecha y hora</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sorteosProgramados.map((sorteo) => (
              <tr key={sorteo.id}>
                <td>{sorteo.id}</td>
                <td>
                  {editingId === sorteo.id ? (
                    <input
                      type="text"
                      value={editValues.nombre || ''}
                      onChange={(e) =>
                        setEditValues({ ...editValues, nombre: e.target.value })
                      }
                    />
                  ) : (
                    sorteo.nombre
                  )}
                </td>
                <td>
                  {editingId === sorteo.id ? (
                    <input
                      type="text"
                      value={editValues.descripcion || ''}
                      onChange={(e) =>
                        setEditValues({ ...editValues, descripcion: e.target.value })
                      }
                    />
                  ) : (
                    sorteo.descripcion
                  )}
                </td>
                <td>
                  {editingId === sorteo.id ? (
                    <input
                      type="datetime-local"
                      value={editValues.fecha_programada || ''}
                      onChange={(e) =>
                        setEditValues({ ...editValues, fecha_programada: e.target.value })
                      }
                    />
                  ) : (
                    new Date(sorteo.fecha_programada).toLocaleString()
                  )}
                </td>
                <td>
                  {editingId === sorteo.id ? (
                    <>
                      <button onClick={() => handleSave(sorteo.id)} className="ejecutar">
                        Guardar
                      </button>
                      <button onClick={cancelEditing} className="rojo">
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <div className="acciones">
                      <button onClick={() => startEditing(sorteo)} className="azul" title="Editar">
                        Editar
                      </button>
                      <button onClick={() => handleDelete(sorteo.id)} className="rojo" title="Eliminar">
                        Eliminar
                      </button>
                      <button onClick={() => handlePlay(sorteo)} className="ejecutar" title="Ejecutar sorteo">
                        {/* Ícono de Play */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style={{ width: '16px', height: '16px', fill: 'white' }}>
                          <path d="M424.4 214.7L72.4 3.7C39.7-10.3 0 6.1 0 43.8v424.4c0 37.7 39.7 54.1 72.4 40.1l352-211c32.7-19.6 32.7-66.3 0-85.9z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay sorteos agendados.</p>
      )}
    </div>
  );
}

export default ScheduledSorteos;
