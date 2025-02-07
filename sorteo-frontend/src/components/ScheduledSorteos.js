// sorteo-frontend/src/components/ScheduledSorteos.js

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import './ScheduledSorteos.css';
import { API_BASE_URL } from '../config';

function ScheduledSorteos() {
  const [sorteosProgramados, setSorteosProgramados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

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

  return (
    <div className="scheduled-container">
      <h2>Sorteos programados</h2>
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
                    <>
                      <button onClick={() => startEditing(sorteo)} className="azul">
                        Editar
                      </button>
                      <button onClick={() => handleDelete(sorteo.id)} className="rojo">
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay sorteos programados.</p>
      )}
    </div>
  );
}

export default ScheduledSorteos;
