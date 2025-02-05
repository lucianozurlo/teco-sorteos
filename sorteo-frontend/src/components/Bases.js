// sorteo-frontend/src/components/Bases.js

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import { API_BASE_URL } from '../config';
import UploadCSV from './UploadCSV';
import AddToBlacklist from './AddToBlacklist'; // Se usará para exclusión individual (se recomienda actualizar su título interno)
import './Bases.css';

function Bases() {
  // Estado para controlar la pestaña activa:
  // 'participantes' → Listado participantes  
  // 'no_incluidos' → Listado No incluidos  
  // 'cargar' → Cargar bases
  const [activeTab, setActiveTab] = useState('participantes');

  // Estado para los datos obtenidos del endpoint de listas  
  // Se asume que el endpoint devuelve un objeto con dos arrays:
  // data.participantes y data.blacklist (ahora serán "No incluidos")
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Estados para paginación (para ambas listas)
  const itemsPerPage = 100;
  const [currentPageParticipantes, setCurrentPageParticipantes] = useState(1);
  const [currentPageNoIncluidos, setCurrentPageNoIncluidos] = useState(1);

  // Función para obtener los datos desde la API
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

  // Paginación para Participantes
  const totalRecordsParticipantes =
    data && data.participantes ? data.participantes.length : 0;
  const totalPagesParticipantes = Math.ceil(
    totalRecordsParticipantes / itemsPerPage
  );
  const paginatedParticipantes =
    data && data.participantes
      ? data.participantes.slice(
          (currentPageParticipantes - 1) * itemsPerPage,
          currentPageParticipantes * itemsPerPage
        )
      : [];

  const handleNextParticipantes = () => {
    if (currentPageParticipantes < totalPagesParticipantes)
      setCurrentPageParticipantes((prev) => prev + 1);
  };

  const handlePrevParticipantes = () => {
    if (currentPageParticipantes > 1)
      setCurrentPageParticipantes((prev) => prev - 1);
  };

  // Paginación para "No incluidos" (excluir)
  const totalRecordsNoIncluidos =
    data && data.blacklist ? data.blacklist.length : 0;
  const totalPagesNoIncluidos = Math.ceil(
    totalRecordsNoIncluidos / itemsPerPage
  );
  const paginatedNoIncluidos =
    data && data.blacklist
      ? data.blacklist.slice(
          (currentPageNoIncluidos - 1) * itemsPerPage,
          currentPageNoIncluidos * itemsPerPage
        )
      : [];

  const handleNextNoIncluidos = () => {
    if (currentPageNoIncluidos < totalPagesNoIncluidos)
      setCurrentPageNoIncluidos((prev) => prev + 1);
  };

  const handlePrevNoIncluidos = () => {
    if (currentPageNoIncluidos > 1)
      setCurrentPageNoIncluidos((prev) => prev - 1);
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

      {activeTab === 'participantes' && (
        <div className="list-section">
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
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPagesParticipantes > 1 && (
                <div className="pagination">
                  <button
                    onClick={handlePrevParticipantes}
                    disabled={currentPageParticipantes === 1}
                  >
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

      {activeTab === 'no_incluidos' && (
        <div className="list-section">
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
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPagesNoIncluidos > 1 && (
                <div className="pagination">
                  <button
                    onClick={handlePrevNoIncluidos}
                    disabled={currentPageNoIncluidos === 1}
                  >
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

      {activeTab === 'cargar' && (
        <div className="cargar-section">
          {/* Aquí se agrupan las funcionalidades para cargar bases */}
          <div className="cargar-item">
            <h3>Cargar CSV</h3>
            <UploadCSV />
          </div>
          <div className="cargar-item">
            <h3>Agregar individualmente</h3>
            {/* Se recomienda actualizar el título interno del componente AddToBlacklist */}
            <AddToBlacklist />
          </div>
        </div>
      )}
    </div>
  );
}

export default Bases;