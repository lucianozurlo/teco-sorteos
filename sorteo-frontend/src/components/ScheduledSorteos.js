// sorteo-frontend/src/components/ScheduledSorteos.js

import React, {useState, useEffect} from 'react';
import {toast} from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import {useNavigate} from 'react-router-dom';
import './ScheduledSorteos.css';
import {API_BASE_URL} from '../config';

function ScheduledSorteos () {
  const [sorteosProgramados, setSorteosProgramados] = useState ([]);
  const [cargando, setCargando] = useState (false);
  const [editingId, setEditingId] = useState (null);
  const [editValues, setEditValues] = useState ({});
  const navigate = useNavigate ();

  useEffect (() => {
    fetchScheduledSorteos ();
  }, []);

  const fetchScheduledSorteos = async () => {
    setCargando (true);
    try {
      const response = await fetch (`${API_BASE_URL}/api/scheduled/`);
      const data = await response.json ();
      setSorteosProgramados (data);
    } catch (error) {
      console.error (error);
      toast.error ('Error al cargar sorteos agendados.');
    } finally {
      setCargando (false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm ('¿Estás seguro de eliminar este sorteo agendado?'))
      return;
    try {
      const response = await fetch (`${API_BASE_URL}/api/scheduled/${id}/`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast.info ('Sorteo agendado eliminado.');
        fetchScheduledSorteos ();
      } else {
        const data = await response.json ();
        toast.error (data.error || 'Error al eliminar el sorteo agendado.');
      }
    } catch (error) {
      console.error (error);
      toast.error ('Error de conexión al eliminar el sorteo agendado.');
    }
  };

  const startEditing = sorteo => {
    setEditingId (sorteo.id);
    setEditValues ({...sorteo});
  };

  const cancelEditing = () => {
    setEditingId (null);
    setEditValues ({});
  };

  const handleSave = async id => {
    try {
      const response = await fetch (`${API_BASE_URL}/api/scheduled/${id}/`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify (editValues),
      });
      const data = await response.json ();
      if (response.ok) {
        toast.success ('Sorteo agendado actualizado.');
        cancelEditing ();
        fetchScheduledSorteos ();
      } else {
        toast.error (data.error || 'Error al actualizar el sorteo agendado.');
      }
    } catch (error) {
      console.error (error);
      toast.error ('Error de conexión al actualizar el sorteo agendado.');
    }
  };

  // Al presionar el botón "Sortear", se redirige a la página de Sorteo
  // pasando los datos del sorteo agendado seleccionado.
  const handlePlay = sorteo => {
    navigate ('/', {state: {scheduledSorteo: sorteo}});
  };

  return (
    <div className="scheduled-container">
      <h2>Sorteos agendados</h2>
      {cargando
        ? <ClipLoader size={50} color="#123abc" />
        : sorteosProgramados.length > 0
            ? <table className="scheduled-table text">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Fecha y hora</th>
                    <th>Provincia</th>
                    <th>Localidad</th>
                    <th>Premios</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sorteosProgramados.map (sorteo => (
                    <tr key={sorteo.id}>
                      <td>{sorteo.id}</td>
                      <td>
                        {editingId === sorteo.id
                          ? <input
                              type="text"
                              value={editValues.nombre || ''}
                              onChange={e =>
                                setEditValues ({
                                  ...editValues,
                                  nombre: e.target.value,
                                })}
                            />
                          : sorteo.nombre}
                      </td>
                      <td>
                        {editingId === sorteo.id
                          ? <input
                              type="text"
                              value={editValues.descripcion || ''}
                              onChange={e =>
                                setEditValues ({
                                  ...editValues,
                                  descripcion: e.target.value,
                                })}
                            />
                          : sorteo.descripcion}
                      </td>
                      <td>
                        {editingId === sorteo.id
                          ? <input
                              type="datetime-local"
                              value={editValues.fecha_programada || ''}
                              onChange={e =>
                                setEditValues ({
                                  ...editValues,
                                  fecha_programada: e.target.value,
                                })}
                            />
                          : new Date (
                              sorteo.fecha_programada
                            ).toLocaleString ()}
                      </td>
                      <td>{sorteo.provincia || '-'}</td>
                      <td>{sorteo.localidad || '-'}</td>
                      <td>
                        {sorteo.premios && sorteo.premios.length > 0
                          ? sorteo.premios
                              .map (p => `${p.premio.nombre} (x${p.cantidad})`)
                              .join (', ')
                          : 'Sin premios'}
                      </td>
                      <td>
                        {editingId === sorteo.id
                          ? <div className="acciones edit">
                              <button
                                onClick={() => handleSave (sorteo.id)}
                                className="ejecutar"
                              >
                                Guardar
                              </button>
                              <button onClick={cancelEditing} className="rojo">
                                Cancelar
                              </button>
                            </div>
                          : <div className="acciones">
                              <button
                                onClick={() => startEditing (sorteo)}
                                className="azul"
                                title="Editar"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  style={{
                                    width: '16px',
                                    height: '16px',
                                    fill: 'white',
                                    marginRight: '7px',
                                  }}
                                >
                                  <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
                                </svg>
                                Editar
                              </button>
                              <button
                                onClick={() => handleDelete (sorteo.id)}
                                className="rojo"
                                title="Eliminar"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 384 512"
                                  style={{
                                    width: '16px',
                                    height: '16px',
                                    fill: 'white',
                                    marginRight: '7px',
                                  }}
                                >
                                  <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                                </svg>
                                Eliminar
                              </button>
                              <button
                                onClick={() => handlePlay (sorteo)}
                                className="verde"
                                title="Sortear"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 448 512"
                                  style={{
                                    width: '16px',
                                    height: '16px',
                                    fill: 'white',
                                    marginRight: '7px',
                                  }}
                                >
                                  <path d="M424.4 214.7L72.4 3.7C39.7-10.3 0 6.1 0 43.8v424.4c0 37.7 39.7 54.1 72.4 40.1l352-211c32.7-19.6 32.7-66.3 0-85.9z" />
                                </svg>
                                Sortear
                              </button>
                            </div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            : <p>No hay sorteos agendados.</p>}
    </div>
  );
}

export default ScheduledSorteos;
