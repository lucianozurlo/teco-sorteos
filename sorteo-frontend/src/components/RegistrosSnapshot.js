// sorteo-frontend/src/components/RegistrosSnapshot.js

import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {API_BASE_URL} from '../config';
import ClipLoader from 'react-spinners/ClipLoader';
import {toast} from 'react-toastify';
import './RegistrosSnapshot.css';

function RegistrosSnapshot () {
  const [snapshots, setSnapshots] = useState ([]);
  const [loading, setLoading] = useState (true);

  useEffect (() => {
    fetch (`${API_BASE_URL}/api/sorteos/snapshots/`)
      .then (res => res.json ())
      .then (data => {
        setSnapshots (data);
        setLoading (false);
      })
      .catch (err => {
        console.error (err);
        toast.error ('Error al cargar los registros de sorteos.');
        setLoading (false);
      });
  }, []);

  if (loading) {
    return <ClipLoader size={50} color="#123abc" />;
  }

  return (
    <div className="registros-container">
      <h1>Registros de Sorteos Realizados</h1>
      {snapshots.length > 0
        ? <ul>
            {snapshots.map (snapshot => (
              <li key={snapshot.id}>
                <Link to={`/detalle-sorteo/${snapshot.id}`}>
                  {snapshot.nombre}
                  {' '}
                  -
                  {' '}
                  {new Date (snapshot.fecha_realizado).toLocaleString ()}
                </Link>
              </li>
            ))}
          </ul>
        : <p>No hay registros de sorteos.</p>}
    </div>
  );
}

export default RegistrosSnapshot;
