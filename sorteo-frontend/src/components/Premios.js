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
			<div className="premios-header">
				<div className="premios-input-group">
					<label>Premio:</label>
					<input
					type="text"
					placeholder="Nombre del premio"
					value={nuevoNombre}
					onChange={(e) => setNuevoNombre(e.target.value)}
					/>
				</div>
				<div className="sorteo-input-group">
					<label>Stock:</label>
					<input
					type="number"
					placeholder="Stock"
					value={nuevoStock}
					onChange={(e) => setNuevoStock(Number(e.target.value))}
					min="1"
					/>
				</div>
				<div className="sorteo-input-group">
					<button onClick={agregarPremio}>Agregar Premio</button>
				</div>
			</div>
		</div>
		<hr />
		<div className="premios-section">
			<h3>Lista de Premios</h3>
        {cargando ? (
          <ClipLoader size={50} color="#123abc" />
        ) : (
          <table className="premios-table text">
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
