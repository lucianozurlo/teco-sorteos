// src/components/SorteoDetalle.js
import React, {useState, useEffect} from 'react';
import {useParams, Link} from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import {toast} from 'react-toastify';
import {API_BASE_URL} from '../config';
import './SorteoDetalle.css';

function SorteoDetalle () {
  const {id} = useParams ();
  const [snapshot, setSnapshot] = useState (null);
  const [loading, setLoading] = useState (true);

  useEffect (
    () => {
      fetch (`${API_BASE_URL}/api/snapshot/${id}/`)
        .then (res => {
          if (!res.ok) {
            throw new Error (`Error ${res.status}`);
          }
          return res.json ();
        })
        .then (data => {
          console.log ('Datos del snapshot:', data);
          setSnapshot (data);
          setLoading (false);
        })
        .catch (err => {
          console.error (err);
          toast.error ('Error al cargar el detalle del sorteo.');
          setLoading (false);
        });
    },
    [id]
  );

  if (loading) {
    return <ClipLoader size={50} color="#123abc" />;
  }

  if (!snapshot) {
    return <p>No se encontró el registro del sorteo.</p>;
  }

  return (
    <div className="sorteo-detalle-container">
      <h1>Detalle del Sorteo</h1>
      <p><strong>Nombre:</strong> {snapshot.nombre}</p>
      {snapshot.descripcion &&
        <p><strong>Descripción:</strong> {snapshot.descripcion}</p>}
      <p>
        <strong>Fecha realizado:</strong>{' '}
        {new Date (snapshot.fecha_realizado).toLocaleString ()}
      </p>
      <h3>Participantes</h3>
      {snapshot.participantes && snapshot.participantes.length > 0
        ? <ul>
            {snapshot.participantes.map (p => (
              <li key={p.id}>
                {p.nombre} {p.apellido} ({p.email})
              </li>
            ))}
          </ul>
        : <p>No hay participantes registrados.</p>}
      <h3>Ganadores</h3>
      {snapshot.ganadores && snapshot.ganadores.length > 0
        ? <ul>
            {snapshot.ganadores.map (g => (
              <li key={g.id}>
                {g.nombre} {g.apellido} ({g.email})
              </li>
            ))}
          </ul>
        : <p>No hay ganadores registrados.</p>}
      <Link to="/registros-sorteos" className="volver-link">
        Volver a Registros
      </Link>
    </div>
  );
}

export default SorteoDetalle;
