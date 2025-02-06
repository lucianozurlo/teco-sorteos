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

  // Renderizado de cada fila en participantes
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
            {/* Botón Editar */}
            <button
              className="azul"
              onClick={() => startEditing (item)}
              style={{backgroundColor: 'transparent', border: 'none'}}
              title="Editar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                style={{width: '16px', height: '16px', fill: 'white'}}
              >
                <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z" />
              </svg>
            </button>
            {/* Botón Mover (según la lista activa) */}
            {activeTab === 'participantes'
              ? <button
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                    style={{width: '16px', height: '16px', fill: 'white'}}
                  >
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                  </svg>
                </button>
              : <button
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    style={{width: '16px', height: '16px', fill: 'white'}}
                  >
                    <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 301.3 297.4 164c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3L237.3 256 342.6 361.4z" />
                  </svg>
                </button>}
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
              {/* Botón Editar con el SVG proporcionado */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                style={{width: '16px', height: '16px', fill: 'white'}}
              >
                <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z" />
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
