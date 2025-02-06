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

  // Función para vaciar la lista de participantes
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

  // Función para vaciar la lista de no incluidos
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
                      {data.participantes.map (item => (
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
                            <button
                              className="rojo"
                              onClick={async () => {
                                try {
                                  const response = await fetch (
                                    `${API_BASE_URL}/api/blacklist/add/`,
                                    {
                                      method: 'POST',
                                      headers: {
                                        'Content-Type': 'application/json',
                                      },
                                      body: JSON.stringify ({id: item.id}),
                                    }
                                  );
                                  const dataResp = await response.json ();
                                  if (response.ok) {
                                    toast.success (dataResp.message);
                                    fetchLists ();
                                  } else {
                                    toast.error (
                                      dataResp.error ||
                                        'Error al mover el registro.'
                                    );
                                  }
                                } catch (err) {
                                  console.error (err);
                                  toast.error ('Error de conexión.');
                                }
                              }}
                              style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                              }}
                              title="Mover a No incluidos"
                            >
                              {/* SVG para mover de participantes a no incluidos */}
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
                            </button>
                          </td>
                        </tr>
                      ))}
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
                      {data.blacklist.map (item => (
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
                                      headers: {
                                        'Content-Type': 'application/json',
                                      },
                                      body: JSON.stringify (payload),
                                    }
                                  );
                                  const dataResp = await response.json ();
                                  if (response.ok) {
                                    toast.success (dataResp.message);
                                    fetchLists ();
                                  } else {
                                    toast.error (
                                      dataResp.error ||
                                        'Error al mover el registro.'
                                    );
                                  }
                                } catch (err) {
                                  console.error (err);
                                  toast.error ('Error de conexión.');
                                }
                              }}
                              style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                              }}
                              title="Mover a Participantes"
                            >
                              {/* SVG para mover de no incluidos a participantes */}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 448 512"
                                style={{
                                  width: '16px',
                                  height: '16px',
                                  fill: 'white',
                                }}
                              >
                                <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
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
