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
