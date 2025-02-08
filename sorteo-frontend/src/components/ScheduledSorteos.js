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
      toast.error('Error al cargar sorteos agendados.');
    } finally {
      setCargando(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este sorteo agendado?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/scheduled/${id}/`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast.info('Sorteo agendado eliminado.');
        fetchScheduledSorteos();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Error al eliminar el sorteo agendado.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error de conexión al eliminar el sorteo agendado.');
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
        toast.success('Sorteo agendado actualizado.');
        cancelEditing();
        fetchScheduledSorteos();
      } else {
        toast.error(data.error || 'Error al actualizar el sorteo agendado.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error de conexión al actualizar el sorteo agendado.');
    }
  };

  const handlePlay = (sorteo) => {
    navigate('/', { state: { scheduledSorteo: sorteo } });
  };

  return (
    <div className="scheduled-container">
      <h2>Sorteos Agendados</h2>
      {cargando ? (
        <ClipLoader size={50} color="#123abc" />
      ) : sorteosProgramados.length > 0 ? (
        <table className="scheduled-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Fecha y Hora de Creación</th>
              <th>Fecha Agendada</th>
              <th>Provincia</th>
              <th>Localidad</th>
              <th>Premios</th>
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
                <td>{new Date(sorteo.fecha_hora).toLocaleString()}</td>
                <td>
                  {editingId === sorteo.id ? (
                    <input
                      type="datetime-local"
                      value={editValues.fecha_programada || ''}
                      onChange={(e) =>
                        setEditValues({
                          ...editValues,
                          fecha_programada: e.target.value,
                        })
                      }
                    />
                  ) : (
                    sorteo.fecha_programada ? new Date(sorteo.fecha_programada).toLocaleString() : ''
                  )}
                </td>
                <td>
                  {editingId === sorteo.id ? (
                    <input
                      type="text"
                      value={editValues.provincia || ''}
                      onChange={(e) =>
                        setEditValues({ ...editValues, provincia: e.target.value })
                      }
                    />
                  ) : (
                    sorteo.provincia || '-'
                  )}
                </td>
                <td>
                  {editingId === sorteo.id ? (
                    <input
                      type="text"
                      value={editValues.localidad || ''}
                      onChange={(e) =>
                        setEditValues({ ...editValues, localidad: e.target.value })
                      }
                    />
                  ) : (
                    sorteo.localidad || '-'
                  )}
                </td>
                <td>
                  {sorteo.premios && sorteo.premios.length > 0
                    ? sorteo.premios
                        .map(p => `${p.premio.nombre} (x${p.cantidad})`)
                        .join(', ')
                    : 'Sin premios'}
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
