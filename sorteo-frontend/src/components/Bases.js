// Bases.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import { API_BASE_URL } from '../config';
import UploadCSV from './UploadCSV';
import AddToBlacklist from './AddToBlacklist';
import './Bases.css';

function Bases() {
  // Estado para controlar la pestaña activa: "carga" o "listas"
  const [activeTab, setActiveTab] = useState('carga');
  
  // Estado para los datos obtenidos del endpoint de listas
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Estados para paginación
  const itemsPerPage = 100;
  const [currentPage, setCurrentPage] = useState(1);

  // Función para obtener los datos (por ejemplo, de participantes y blacklist)
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

  // Supongamos que en la respuesta, el listado principal está en data.participantes
  const totalRecords = data && data.participantes ? data.participantes.length : 0;
  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  const paginatedRecords =
    data && data.participantes
      ? data.participantes.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        )
      : [];

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="bases-container">
      <h2>Bases</h2>
      <div className="tabs">
        <button
          className={activeTab === 'carga' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('carga')}
        >
          Carga
        </button>
        <button
          className={activeTab === 'listas' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('listas')}
        >
          Listas
        </button>
      </div>

      {activeTab === 'carga' && (
        <div className="carga-section">
          {/* Se renderizan ambos componentes para subir CSV y agregar a lista negra */}
          <UploadCSV />
          <AddToBlacklist />
        </div>
      )}

      {activeTab === 'listas' && (
        <div className="listas-section">
          {loading ? (
            <ClipLoader size={50} color="#123abc" />
          ) : data ? (
            <>
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
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
                  {paginatedRecords.map((item) => (
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
              {totalPages > 1 && (
                <div className="pagination">
                  <button onClick={handlePrev} disabled={currentPage === 1}>
                    Anterior
                  </button>
                  <span>
                    Página {currentPage} de {totalPages}
                  </span>
                  <button onClick={handleNext} disabled={currentPage === totalPages}>
                    Siguiente
                  </button>
                </div>
              )}
            </>
          ) : (
            <p>No se encontraron registros.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Bases;
