// sorteo-frontend/src/components/Bases.js

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import { API_BASE_URL } from '../config';
import UploadCSV from './UploadCSV';
import AddToBlacklist from './AddToBlacklist';
import AddToParticipants from './AddToParticipants';
import './Bases.css';

function Bases() {
  // Estado para controlar la pestaña activa:
  // 'participantes' → Listado de participantes  
  // 'no_incluidos' → Listado de no incluidos  
  // 'cargar' → Sección para cargar archivos CSV y agregar manualmente a ambas listas
  const [activeTab, setActiveTab] = useState('participantes');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Estados para paginación
  const itemsPerPage = 100;
  const [currentPageParticipantes, setCurrentPageParticipantes] = useState(1);
  const [currentPageNoIncluidos, setCurrentPageNoIncluidos] = useState(1);

  // Función para obtener las listas de participantes y no incluidos
  const fetchLists = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/lists/`);
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error(error);
      toast.error('Error al obtener las bases.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  // Función para borrar todos los participantes
  const handleClearParticipants = async () => {
    if (!window.confirm("¿Estás seguro de borrar todos los participantes?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/lists/clear/participantes/`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        fetchLists();
      } else {
        toast.error(data.error || 'Error al borrar participantes.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error de conexión.');
    }
  };

  // Función para borrar la lista de no incluidos
  const handleClearBlacklist = async () => {
    if (!window.confirm("¿Estás seguro de borrar la lista de no incluidos?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/lists/clear/blacklist/`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        fetchLists();
      } else {
        toast.error(data.error || 'Error al borrar la lista de no incluidos.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error de conexión.');
    }
  };


  // Paginación para la lista de participantes
  const totalRecordsParticipantes = data && data.participantes ? data.participantes.length : 0;
  const totalPagesParticipantes = Math.ceil(totalRecordsParticipantes / itemsPerPage);
  const paginatedParticipantes = data && data.participantes ? data.participantes.slice(
    (currentPageParticipantes - 1) * itemsPerPage,
    currentPageParticipantes * itemsPerPage
  ) : [];

  const handleNextParticipantes = () => {
    if (currentPageParticipantes < totalPagesParticipantes)
      setCurrentPageParticipantes((prev) => prev + 1);
  };

  const handlePrevParticipantes = () => {
    if (currentPageParticipantes > 1)
      setCurrentPageParticipantes((prev) => prev - 1);
  };

  // Paginación para la lista de no incluidos
  const totalRecordsNoIncluidos = data && data.blacklist ? data.blacklist.length : 0;
  const totalPagesNoIncluidos = Math.ceil(totalRecordsNoIncluidos / itemsPerPage);
  const paginatedNoIncluidos = data && data.blacklist ? data.blacklist.slice(
    (currentPageNoIncluidos - 1) * itemsPerPage,
    currentPageNoIncluidos * itemsPerPage
  ) : [];

  const handleNextNoIncluidos = () => {
    if (currentPageNoIncluidos < totalPagesNoIncluidos)
      setCurrentPageNoIncluidos((prev) => prev + 1);
  };

  const handlePrevNoIncluidos = () => {
    if (currentPageNoIncluidos > 1)
      setCurrentPageNoIncluidos((prev) => prev - 1);
  };

  // Handler para mover un registro de participantes a la lista de no incluidos
  const handleNoIncluir = async (participante) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/blacklist/add/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(participante),
      });
      const respData = await response.json();
      if (response.ok) {
        toast.success(respData.message);
        fetchLists(); // Actualiza ambas listas
      } else {
        toast.error(respData.error || 'Error al agregar a no incluidos.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error de conexión.');
    }
  };

  // Handler para quitar un registro de la lista de no incluidos (remover de blacklist)
  const handleQuitar = async (legajo) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/blacklist/remove/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: legajo }),
      });
      const respData = await response.json();
      if (response.ok) {
        toast.success(respData.message);
        fetchLists(); // Actualiza ambas listas
      } else {
        toast.error(respData.error || 'Error al quitar de la lista de no incluidos.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error de conexión.');
    }
  };

  return (
    <div className="bases-container">
      <h2>Bases</h2>
      <div className="tabs">
        <button
          className={activeTab === 'participantes' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('participantes')}
        >
          Listado participantes
        </button>
        <button
          className={activeTab === 'no_incluidos' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('no_incluidos')}
        >
          Listado No incluidos
        </button>
        <button
          className={activeTab === 'cargar' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('cargar')}
        >
          Cargar bases
        </button>
      </div>

      {/* Pestaña de participantes */}
      {activeTab === 'participantes' && (
        <div className="list-section">
          {/* Botón para borrar todos los participantes */}
          <div style={{ marginBottom: '10px' }}>
            <button onClick={handleClearParticipants}>Borrar lista</button>
          </div>
          {loading ? (
            <ClipLoader size={50} color="#123abc" />
          ) : data && data.participantes && data.participantes.length > 0 ? (
            <>
              <table className="table">
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
                  {paginatedParticipantes.map((item) => (
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
                        <button onClick={() => handleNoIncluir(item)}>No Incluir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPagesParticipantes > 1 && (
                <div className="pagination">
                  <button onClick={handlePrevParticipantes} disabled={currentPageParticipantes === 1}>
                    Anterior
                  </button>
                  <span>
                    Página {currentPageParticipantes} de {totalPagesParticipantes}
                  </span>
                  <button
                    onClick={handleNextParticipantes}
                    disabled={currentPageParticipantes === totalPagesParticipantes}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          ) : (
            <p>No se encontraron registros de participantes.</p>
          )}
        </div>
      )}

      {/* Pestaña de no incluidos */}
      {activeTab === 'no_incluidos' && (
        <div className="list-section">
          {/* Botón para borrar la lista de no incluidos */}
          <div style={{ marginBottom: '10px' }}>
            <button onClick={handleClearBlacklist}>Borrar lista</button>
          </div>
          {loading ? (
            <ClipLoader size={50} color="#123abc" />
          ) : data && data.blacklist && data.blacklist.length > 0 ? (
            <>
              <table className="table">
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
                  {paginatedNoIncluidos.map((item) => (
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
                        <button onClick={() => handleQuitar(item.id)}>Quitar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPagesNoIncluidos > 1 && (
                <div className="pagination">
                  <button onClick={handlePrevNoIncluidos} disabled={currentPageNoIncluidos === 1}>
                    Anterior
                  </button>
                  <span>
                    Página {currentPageNoIncluidos} de {totalPagesNoIncluidos}
                  </span>
                  <button
                    onClick={handleNextNoIncluidos}
                    disabled={currentPageNoIncluidos === totalPagesNoIncluidos}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          ) : (
            <p>No se encontraron registros en el listado de No incluidos.</p>
          )}
        </div>
      )}

      {/* Pestaña de cargar bases */}
      {activeTab === 'cargar' && (
        <div className="cargar-section">
          <div className="cargar-item">
            <h3>Cargar base de participantes</h3>
            <UploadCSV />
          </div>
          <div className="cargar-item">
            <h3>Agregar individualmente</h3>
            <AddToParticipants />
            <AddToBlacklist />
          </div>
        </div>
      )}
    </div>
  );
}

export default Bases;