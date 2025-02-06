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
  // Para manejar la edición inline: editRow contiene el id de la fila en edición y editValues sus datos
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

  // Manejo del modo edición
  const startEditing = item => {
    setEditRow (item.id);
    // Inicializamos editValues con los valores actuales del item
    setEditValues ({...item});
  };

  const cancelEditing = () => {
    setEditRow (null);
    setEditValues ({});
  };

  // Función para guardar la edición: se usa el endpoint según la pestaña activa
  const saveEditing = async id => {
    // No permitimos editar el legajo
    const payload = {...editValues, id};
    try {
      let url = '';
      if (activeTab === 'participantes') {
        url = `${API_BASE_URL}/api/participants/add/`;
      } else if (activeTab === 'no_incluidos') {
        url = `${API_BASE_URL}/api/blacklist/add/`;
      }
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

  // Renderizado de cada fila: si es la fila en edición, mostramos inputs
  const renderRow = (item, isBlacklist = false) => {
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
                Guardar{' '}
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

  // Función similar para filas en la lista de no incluidos
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



// sorteo-frontend/src/components/Sorteo.js

import React, { useState, useEffect } from 'react';
import {
DndContext,
closestCenter,
KeyboardSensor,
PointerSensor,
useSensor,
useSensors
} from '@dnd-kit/core';
import {
arrayMove,
SortableContext,
useSortable,
verticalListSortingStrategy
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
cursor: 'grab'
};

return (
<li ref={setNodeRef} style={style} {...attributes} {...listeners}>
	<strong>{index + 1}°</strong> {nombre_item} - Cantidad: {cantidad}
</li>
);
}

//
// Componente Sorteo (sin WebSocket)
//
function Sorteo() {
// 1) Campos básicos del sorteo
const [nombreSorteo, setNombreSorteo] = useState('');
const [descripcion, setDescripcion] = useState('');

// 2) Filtros
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

// Cargar localidades cuando cambia provincia
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
	// Filtrar premios con stock > 0
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
setItems([...items, {
	id: premio.id,
	nombre_item: premio.nombre,
	cantidad: selectedPremioCantidad
}]);
// Remueve el premio de la lista disponible
setAvailablePremios(availablePremios.filter(p => p.id !== premio.id));
// Resetea la selección
setSelectedPremioId('');
setSelectedPremioCantidad(1);
toast.success(`Premio "${premio.nombre}" agregado al sorteo.`);
};

// Eliminar un premio del sorteo
const eliminarPremioDelSorteo = (id) => {
const premio = items.find(p => p.id === id);
if (!premio) return;
setItems(items.filter(p => p.id !== id));
// Reinserta el premio a la lista de disponibles (puedes ajustar la lógica de stock según sea necesario)
setAvailablePremios([...availablePremios, {
	id: premio.id,
	nombre: premio.nombre_item,
	stock: premio.cantidad
}]);
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

// Enviar la solicitud del sorteo (sin window.confirm)
const handleSortear = async () => {
if (items.length === 0) {
	toast.error('Por favor, agregá al menos un premio para sortear.');
	return;
}
// Se suma la cantidad de cada premio (ya viene en cada objeto)
const premiosConOrden = items.map((it, index) => ({
	premio_id: it.id,
	orden_item: index + 1,
	cantidad: it.cantidad
}));
const payload = {
	nombre: nombreSorteo,
	descripcion: descripcion,
	premios: premiosConOrden
};
if (usarFiltros) {
	payload.provincia = provinciaSeleccionada;
	payload.localidad = localidadSeleccionada;
}
console.log("Enviando solicitud con payload:", payload);
setCargando(true);
try {
	const response = await fetch(`${API_BASE_URL}/api/sortear/`, {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify(payload),
	});
	const data = await response.json();
	console.log("Respuesta del servidor:", data);
	if (response.ok) {
	setResultado(data);
	// Actualiza la lista de premios disponibles (por si el stock cambió)
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
	console.error("Error de conexión:", err);
	toast.error('Error de conexión');
	setResultado(null);
} finally {
	setCargando(false);
}
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
		onChange={(e) => setNombreSorteo(e.target.value)}
		placeholder="Nombre del sorteo"
	/>
	</div>
	<div className="sorteo-section">
	<label>Descripción:</label>
	<input
		type="text"
		value={descripcion}
		onChange={(e) => setDescripcion(e.target.value)}
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
	<>
	    <div className="sorteo-section d-flex">
			<div className="half">
			<label>Provincia:</label>
			<select
				value={provinciaSeleccionada}
				onChange={(e) => setProvinciaSeleccionada(e.target.value)}
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
				onChange={(e) => setLocalidadSeleccionada(e.target.value)}
				disabled={!provinciaSeleccionada}
			>
				<option value="">-- Seleccionar localidad --</option>
				{localidades.map((loc, idx) => (
				<option key={idx} value={loc}>{loc}</option>
				))}
			</select>
			</div>
		</div>
	</>
	)}
	<hr />
	{/* Agregar Premios */}
	<h4>Agregar Premios al Sorteo</h4>
	<div className="sorteo-section">
	<label>Seleccioná un premio:</label>
	<select
		value={selectedPremioId}
		onChange={(e) => setSelectedPremioId(e.target.value)}
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
		onChange={(e) => setSelectedPremioCantidad(Number(e.target.value))}
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
	{/* Lista de premios con opción de eliminar */}
	{items.length > 0 && (
	<div className="sorteo-section">
		<h4>Lista de Premios para sortear</h4>
		<ul className="sorteo-list">
		{items.map(item => (
			<li key={item.id} className="sorteo-item">
			{item.nombre_item} - Cantidad: {item.cantidad}
			<button onClick={() => eliminarPremioDelSorteo(item.id)} className="rojo">
				Eliminar
			</button>
			</li>
		))}
		</ul>
	</div>
	)}
	<hr />
	{/* Botón para realizar sorteo */}
	<div className="sortear">
	<button onClick={handleSortear} className="ejecutar" disabled={cargando}>
		{cargando ? <ClipLoader size={20} color="#ffffff" /> : 'Sortear'}
	</button>
	</div>
	{/* Mostrar resultado */}
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




// sorteo-frontend/src/App.js

import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from './Header';
import Sorteo from './components/Sorteo';
import Premios from './components/Premios';
import Registro from './components/Registro';
import Bases from './components/Bases';
import AdminRedirect from './components/AdminRedirect';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import './App.css';

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
          <Route path="/admin" element={<AdminRedirect />} />
        </Routes>
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;



// sorteo-frontend/src/config.js;

// export const API_BASE_URL =
//   process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

export const API_BASE_URL = 'https://web-production-0252.up.railway.app';

export const ADMIN_URL =
  process.env.REACT_APP_ADMIN_URL || `${API_BASE_URL}/admin/`;




// sorteo-frontend/src/Header.js

import React from 'react';
import {NavLink} from 'react-router-dom';
import './Header.css';

function Header () {
  return (
    <header>
      <div className="header-inner">
        <div className="header-logo">
          Sorteos CI
        </div>
        <ul className="nav-links">
          <li><NavLink to="/">Sorteo</NavLink></li>
          <li><NavLink to="/premios">Premios</NavLink></li>
          <li><NavLink to="/registro">Registro</NavLink></li>
          <li><NavLink to="/bases">Bases</NavLink></li>
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





// sorteo-frontend/src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById ('root');
const root = ReactDOM.createRoot (container);

root.render (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals (console.log);





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
