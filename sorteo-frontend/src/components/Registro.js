// sorteo-frontend/src/components/Registro.js

import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import { API_BASE_URL } from '../config';
import './Registro.css';

function Registro() {
  // Estados para "Resultados de Sorteos"
  const [resultados, setResultados] = useState([]);
  const [cargandoResultados, setCargandoResultados] = useState(false);

  // Estados para "Sorteos Realizados"
  const [sorteos, setSorteos] = useState([]);
  const [cargandoSorteos, setCargandoSorteos] = useState(false);

  // Estado para "Registro de Actividades"
  const [actividad, setActividad] = useState([]);
  const [cargandoActividad, setCargandoActividad] = useState(false);

  // Sorting y filtrado para Resultados de Sorteos
  const [sortConfig, setSortConfig] = useState({ key: 'fecha', direction: 'desc' });
  const [filtroSorteo, setFiltroSorteo] = useState('');
  const [filtroParticipante, setFiltroParticipante] = useState('');
  const [filtroPremio, setFiltroPremio] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');

  // Sorting y filtrado para Sorteos Realizados
  const [filtroSorteoNombre, setFiltroSorteoNombre] = useState('');
  const [filtroSorteoDescripcion, setFiltroSorteoDescripcion] = useState('');
  const [filtroSorteoFecha, setFiltroSorteoFecha] = useState('');
  const [sortConfigSorteo, setSortConfigSorteo] = useState({ key: 'fecha_hora', direction: 'desc' });

  // Opciones de filtro para Resultados y Sorteos Realizados
  const [opcionesSorteo, setOpcionesSorteo] = useState([]);
  const [opcionesParticipante, setOpcionesParticipante] = useState([]);
  const [opcionesPremio, setOpcionesPremio] = useState([]);
  const [opcionesFecha, setOpcionesFecha] = useState([]);
  const [opcionesSorteoNombre, setOpcionesSorteoNombre] = useState([]);
  const [opcionesSorteoFecha, setOpcionesSorteoFecha] = useState([]);

  // Función para obtener Resultados de Sorteos
  const fetchResultados = async () => {
    setCargandoResultados(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/resultados_sorteo/`);
      const data = await response.json();
      // Ordenar de más nuevo a más viejo según "fecha"
      const resultadosOrdenados = data.sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha)
      );
      setResultados(resultadosOrdenados);
    } catch (error) {
      console.error('Error al obtener resultados:', error);
      toast.error('Error al obtener resultados.');
    } finally {
      setCargandoResultados(false);
    }
  };

  // Función para obtener Sorteos Realizados
  const fetchSorteos = async () => {
    setCargandoSorteos(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/sorteos/`);
      const data = await response.json();
      // Ordenar de más nuevo a más viejo según "fecha_hora"
      const sorteosOrdenados = data.sort(
        (a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora)
      );
      setSorteos(sorteosOrdenados);
    } catch (error) {
      console.error('Error al obtener sorteos:', error);
      toast.error('Error al obtener sorteos.');
    } finally {
      setCargandoSorteos(false);
    }
  };

  // Función para obtener Registro de Actividades
  const fetchActividad = async () => {
    setCargandoActividad(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/registro_actividad/`);
      const data = await response.json();
      setActividad(data);
    } catch (error) {
      console.error('Error al obtener actividad:', error);
      toast.error('Error al obtener actividad.');
    } finally {
      setCargandoActividad(false);
    }
  };

  useEffect(() => {
    fetchResultados();
    fetchSorteos();
    fetchActividad();
  }, []);

  // Opciones de filtro para "Resultados de Sorteos"
  useEffect(() => {
    const nombresSorteo = Array.from(
      new Set(resultados.map(r => (r.sorteo && r.sorteo.nombre) || ''))
    ).filter(Boolean);
    setOpcionesSorteo(nombresSorteo);

    const nombresParticipante = Array.from(
      new Set(
        resultados
          .map(r =>
            r.participante ? `${r.participante.nombre} ${r.participante.apellido}` : ''
          )
          .filter(Boolean)
      )
    );
    setOpcionesParticipante(nombresParticipante);

    const nombresPremio = Array.from(
      new Set(resultados.map(r => (r.premio && r.premio.nombre) || '').filter(Boolean))
    );
    setOpcionesPremio(nombresPremio);

    const fechasUnicas = Array.from(
      new Set(
        resultados
          .map(r => {
            const d = new Date(r.fecha);
            return `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}`;
          })
          .filter(Boolean)
      )
    );
    setOpcionesFecha(fechasUnicas);
  }, [resultados]);

  // Opciones de filtro para "Sorteos Realizados"
  useEffect(() => {
    const nombres = Array.from(new Set(sorteos.map(s => s.nombre).filter(Boolean)));
    setOpcionesSorteoNombre(nombres);

    const fechas = Array.from(
      new Set(
        sorteos
          .map(s => {
            const d = new Date(s.fecha_hora);
            return `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}`;
          })
          .filter(Boolean)
      )
    );
    setOpcionesSorteoFecha(fechas);
  }, [sorteos]);

  // Función para ordenar Resultados de Sorteos
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Variable ordenada para Resultados de Sorteos
  const sortedResultados = useMemo(() => {
    let sortableItems = [...resultados];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aVal, bVal;
        switch (sortConfig.key) {
          case 'id':
            aVal = a.id;
            bVal = b.id;
            break;
          case 'sorteo':
            aVal = a.sorteo?.nombre || '';
            bVal = b.sorteo?.nombre || '';
            break;
          case 'participante':
            aVal = a.participante ? `${a.participante.nombre} ${a.participante.apellido}` : '';
            bVal = b.participante ? `${b.participante.nombre} ${b.participante.apellido}` : '';
            break;
          case 'premio':
            aVal = a.premio?.nombre || '';
            bVal = b.premio?.nombre || '';
            break;
          case 'fecha':
            aVal = new Date(a.fecha);
            bVal = new Date(b.fecha);
            break;
          default:
            return 0;
        }
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [resultados, sortConfig]);

  // Función para ordenar Sorteos Realizados
  const requestSortSorteo = (key) => {
    let direction = 'asc';
    if (sortConfigSorteo.key === key && sortConfigSorteo.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfigSorteo({ key, direction });
  };

  const sortedSorteos = useMemo(() => {
    let sortableItems = [...sorteos.filter(s => {
      const matchNombre = filtroSorteoNombre ? s.nombre === filtroSorteoNombre : true;
      const matchDescripcion = filtroSorteoDescripcion
        ? s.descripcion.toLowerCase().includes(filtroSorteoDescripcion.toLowerCase())
        : true;
      const d = new Date(s.fecha_hora);
      const fechaFormateada = `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}`;
      const matchFecha = filtroSorteoFecha ? fechaFormateada === filtroSorteoFecha : true;
      return matchNombre && matchDescripcion && matchFecha;
    })];
    if (sortConfigSorteo !== null) {
      sortableItems.sort((a, b) => {
        let aVal, bVal;
        switch (sortConfigSorteo.key) {
          case 'id':
            aVal = a.id;
            bVal = b.id;
            break;
          case 'nombre':
            aVal = a.nombre || '';
            bVal = b.nombre || '';
            break;
          case 'descripcion':
            aVal = a.descripcion || '';
            bVal = b.descripcion || '';
            break;
          case 'fecha_hora':
            aVal = new Date(a.fecha_hora);
            bVal = new Date(b.fecha_hora);
            break;
          default:
            return 0;
        }
        if (aVal < bVal) return sortConfigSorteo.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfigSorteo.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [sorteos, filtroSorteoNombre, filtroSorteoDescripcion, filtroSorteoFecha, sortConfigSorteo]);

  const clearSorteoFilters = () => {
    setFiltroSorteoNombre('');
    setFiltroSorteoDescripcion('');
    setFiltroSorteoFecha('');
  };

  return (
    <div className="registro-container">
      <h2>Registro de Sorteos y Actividades</h2>

      <h3>Resultados de Sorteos</h3>
      <div className="registro-section">
        {cargandoResultados ? (
          <ClipLoader size={50} color="#123abc" />
        ) : (
          <table className="registro-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('id')} style={{ cursor: 'pointer' }}>
                  ID {sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => requestSort('sorteo')} style={{ cursor: 'pointer' }}>
                  Sorteo {sortConfig.key === 'sorteo' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => requestSort('participante')} style={{ cursor: 'pointer' }}>
                  Participante {sortConfig.key === 'participante' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => requestSort('premio')} style={{ cursor: 'pointer' }}>
                  Premio {sortConfig.key === 'premio' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => requestSort('fecha')} style={{ cursor: 'pointer' }}>
                  Fecha {sortConfig.key === 'fecha' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedResultados.map((resultado) => (
                <tr key={resultado.id}>
                  <td>{resultado.id}</td>
                  <td>{resultado.sorteo && resultado.sorteo.nombre ? resultado.sorteo.nombre : 'Sin nombre'}</td>
                  <td>
                    {(resultado.participante && resultado.participante.nombre) || 'Sin participante'}{' '}
                    {(resultado.participante && resultado.participante.apellido) || ''}
                  </td>
                  <td>{resultado.premio && resultado.premio.nombre ? resultado.premio.nombre : 'Sin premio'}</td>
                  <td>{new Date(resultado.fecha).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <hr />

      <h3>Lista de Sorteos Realizados</h3>
      <div className="filtros-container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
        <div className="filtro">
          <label>Nombre:</label>
          <select value={filtroSorteoNombre} onChange={(e) => setFiltroSorteoNombre(e.target.value)}>
            <option value="">Todos</option>
            {opcionesSorteoNombre.map((nombre, idx) => (
              <option key={idx} value={nombre}>{nombre}</option>
            ))}
          </select>
        </div>
        <div className="filtro">
          <label>Descripción:</label>
          <input
            type="text"
            value={filtroSorteoDescripcion}
            onChange={(e) => setFiltroSorteoDescripcion(e.target.value)}
            placeholder="Buscar descripción..."
          />
        </div>
        <div className="filtro">
          <label>Fecha:</label>
          <select value={filtroSorteoFecha} onChange={(e) => setFiltroSorteoFecha(e.target.value)}>
            <option value="">Todas</option>
            {opcionesSorteoFecha.map((fecha, idx) => (
              <option key={idx} value={fecha}>{fecha}</option>
            ))}
          </select>
        </div>
        <div className="filtro">
          <button onClick={clearSorteoFilters}>Eliminar Filtros</button>
        </div>
      </div>
      <div className="registro-section">
        {cargandoSorteos ? (
          <ClipLoader size={50} color="#123abc" />
        ) : sorteos.length > 0 ? (
          <table className="registro-table">
            <thead>
              <tr>
                <th onClick={() => requestSortSorteo('id')} style={{ cursor: 'pointer' }}>
                  ID {sortConfigSorteo.key === 'id' ? (sortConfigSorteo.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => requestSortSorteo('nombre')} style={{ cursor: 'pointer' }}>
                  Nombre {sortConfigSorteo.key === 'nombre' ? (sortConfigSorteo.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => requestSortSorteo('descripcion')} style={{ cursor: 'pointer' }}>
                  Descripción {sortConfigSorteo.key === 'descripcion' ? (sortConfigSorteo.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => requestSortSorteo('fecha_hora')} style={{ cursor: 'pointer' }}>
                  Fecha y Hora {sortConfigSorteo.key === 'fecha_hora' ? (sortConfigSorteo.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th>Fecha Programada</th>
                <th>Provincia</th>
                <th>Localidad</th>
                <th>Premios</th>
              </tr>
            </thead>
            <tbody>
              {sortedSorteos.map((sorteo) => (
                <tr key={sorteo.id}>
                  <td>{sorteo.id}</td>
                  <td>{sorteo.nombre || 'Sin nombre'}</td>
                  <td>{sorteo.descripcion || '-'}</td>
                  <td>{new Date(sorteo.fecha_hora).toLocaleString()}</td>
                  <td>{sorteo.fecha_programada ? new Date(sorteo.fecha_programada).toLocaleString() : ''}</td>
                  <td>{sorteo.provincia || '-'}</td>
                  <td>{sorteo.localidad || '-'}</td>
                  <td>
                    {sorteo.premios && sorteo.premios.length > 0
                      ? sorteo.premios
                          .map(p => `${p.premio.nombre} (x${p.cantidad})`)
                          .join(', ')
                      : 'Sin premios'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No se encontraron registros de sorteos.</p>
        )}
      </div>

      <hr />

      <h3>Registro de Actividades</h3>
      <div className="registro-section">
        {cargandoActividad ? (
          <ClipLoader size={50} color="#123abc" />
        ) : (
          <ul className="actividad-list">
            {actividad.map(act => (
              <li key={act.id}>
                {new Date(act.fecha_hora).toLocaleString()} - {act.evento}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Registro;
