// sorteo-frontend/src/components/Registro.js
import React, {useState, useEffect, useMemo} from 'react';
import {toast} from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import {API_BASE_URL} from '../config';
import {useNavigate} from 'react-router-dom';
import './Registro.css';

function Registro () {
  // Estados para "Resultados de Sorteos"
  const [resultados, setResultados] = useState ([]);
  const [cargandoResultados, setCargandoResultados] = useState (false);

  // Estados para "Sorteos Realizados"
  const [sorteos, setSorteos] = useState ([]);
  const [cargandoSorteos, setCargandoSorteos] = useState (false);

  // Estado para "Registro de Actividades"
  const [actividad, setActividad] = useState ([]);
  const [cargandoActividad, setCargandoActividad] = useState (false);

  // Estados para filtros en Sorteos Realizados
  const [filtroSorteoNombre, setFiltroSorteoNombre] = useState ('');
  const [filtroSorteoDescripcion, setFiltroSorteoDescripcion] = useState ('');
  const [filtroSorteoFecha, setFiltroSorteoFecha] = useState ('');
  const [sortConfigSorteo, setSortConfigSorteo] = useState ({
    key: 'fecha_hora',
    direction: 'desc',
  });

  const navigate = useNavigate ();

  // Función para obtener Resultados de Sorteos
  const fetchResultados = async () => {
    setCargandoResultados (true);
    try {
      const response = await fetch (`${API_BASE_URL}/api/resultados_sorteo/`);
      const data = await response.json ();
      const resultadosOrdenados = data.sort (
        (a, b) => new Date (b.fecha) - new Date (a.fecha)
      );
      setResultados (resultadosOrdenados);
    } catch (error) {
      console.error ('Error al obtener resultados:', error);
      toast.error ('Error al obtener resultados.');
    } finally {
      setCargandoResultados (false);
    }
  };

  // Función para obtener Sorteos Realizados
  const fetchSorteos = async () => {
    setCargandoSorteos (true);
    try {
      const response = await fetch (`${API_BASE_URL}/api/sorteos/`);
      const data = await response.json ();
      const sorteosOrdenados = data.sort (
        (a, b) => new Date (b.fecha_hora) - new Date (a.fecha_hora)
      );
      setSorteos (sorteosOrdenados);
    } catch (error) {
      console.error ('Error al obtener sorteos:', error);
      toast.error ('Error al obtener sorteos.');
    } finally {
      setCargandoSorteos (false);
    }
  };

  // Función para obtener Registro de Actividades
  const fetchActividad = async () => {
    setCargandoActividad (true);
    try {
      const response = await fetch (`${API_BASE_URL}/api/registro_actividad/`);
      const data = await response.json ();
      setActividad (data);
    } catch (error) {
      console.error ('Error al obtener actividad:', error);
      toast.error ('Error al obtener actividad.');
    } finally {
      setCargandoActividad (false);
    }
  };

  useEffect (() => {
    fetchResultados ();
    fetchSorteos ();
    fetchActividad ();
  }, []);

  // Opciones de filtro para Sorteos Realizados (si se desea implementarlas en el futuro)
  // Se pueden dejar si se planea usarlas, pero por ahora se eliminan si no se utilizan.

  const requestSortSorteo = key => {
    let direction = 'asc';
    if (sortConfigSorteo.key === key && sortConfigSorteo.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfigSorteo ({key, direction});
  };

  const sortedSorteos = useMemo (
    () => {
      let sortableItems = [
        ...sorteos.filter (s => {
          const matchNombre = filtroSorteoNombre
            ? s.nombre === filtroSorteoNombre
            : true;
          const matchDescripcion = filtroSorteoDescripcion
            ? s.descripcion
                .toLowerCase ()
                .includes (filtroSorteoDescripcion.toLowerCase ())
            : true;
          const d = new Date (s.fecha_hora);
          const fechaFormateada = `${d.getFullYear ()}-${('0' + (d.getMonth () + 1)).slice (-2)}-${('0' + d.getDate ()).slice (-2)}`;
          const matchFecha = filtroSorteoFecha
            ? fechaFormateada === filtroSorteoFecha
            : true;
          return matchNombre && matchDescripcion && matchFecha;
        }),
      ];
      if (sortConfigSorteo !== null) {
        sortableItems.sort ((a, b) => {
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
              aVal = new Date (a.fecha_hora);
              bVal = new Date (b.fecha_hora);
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
    },
    [
      sorteos,
      filtroSorteoNombre,
      filtroSorteoDescripcion,
      filtroSorteoFecha,
      sortConfigSorteo,
    ]
  );

  return (
    <div className="registro-container">
      <h2>Registro de Sorteos y Actividades</h2>

      {/* Resultados de Sorteos */}
      <h3>Resultados de Sorteos</h3>
      <div className="registro-section">
        {cargandoResultados
          ? <ClipLoader size={50} color="#123abc" />
          : <table className="registro-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Sorteo</th>
                  <th>Participante</th>
                  <th>Premio</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {resultados.map (resultado => (
                  <tr key={resultado.id}>
                    <td>{resultado.id}</td>
                    <td>
                      {resultado.sorteo && resultado.sorteo.nombre
                        ? resultado.sorteo.nombre
                        : 'Sin nombre'}
                    </td>
                    <td>
                      {(resultado.participante &&
                        resultado.participante.nombre) ||
                        'Sin participante'}
                      {' '}
                      {(resultado.participante &&
                        resultado.participante.apellido) ||
                        ''}
                    </td>
                    <td>
                      {resultado.premio && resultado.premio.nombre
                        ? resultado.premio.nombre
                        : 'Sin premio'}
                    </td>
                    <td>{new Date (resultado.fecha).toLocaleString ()}</td>
                  </tr>
                ))}
              </tbody>
            </table>}
      </div>

      <hr />

      {/* Lista de Sorteos Realizados */}
      <h3>Lista de Sorteos Realizados</h3>
      <div className="registro-section">
        {cargandoSorteos
          ? <ClipLoader size={50} color="#123abc" />
          : sorteos.length > 0
              ? <table className="registro-table">
                  <thead>
                    <tr>
                      <th
                        onClick={() => requestSortSorteo ('id')}
                        style={{cursor: 'pointer'}}
                      >
                        ID
                        {' '}
                        {sortConfigSorteo.key === 'id'
                          ? sortConfigSorteo.direction === 'asc' ? '▲' : '▼'
                          : ''}
                      </th>
                      <th
                        onClick={() => requestSortSorteo ('nombre')}
                        style={{cursor: 'pointer'}}
                      >
                        Nombre
                        {' '}
                        {sortConfigSorteo.key === 'nombre'
                          ? sortConfigSorteo.direction === 'asc' ? '▲' : '▼'
                          : ''}
                      </th>
                      <th
                        onClick={() => requestSortSorteo ('descripcion')}
                        style={{cursor: 'pointer'}}
                      >
                        Descripción
                        {' '}
                        {sortConfigSorteo.key === 'descripcion'
                          ? sortConfigSorteo.direction === 'asc' ? '▲' : '▼'
                          : ''}
                      </th>
                      <th
                        onClick={() => requestSortSorteo ('fecha_hora')}
                        style={{cursor: 'pointer'}}
                      >
                        Fecha y Hora
                        {' '}
                        {sortConfigSorteo.key === 'fecha_hora'
                          ? sortConfigSorteo.direction === 'asc' ? '▲' : '▼'
                          : ''}
                      </th>
                      <th>Fecha Programada</th>
                      <th>Provincia</th>
                      <th>Localidad</th>
                      <th>Premios</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedSorteos.map (sorteo => (
                      <tr
                        key={sorteo.id}
                        onClick={() =>
                          navigate (`/detalle-sorteo/${sorteo.id}`)}
                        style={{cursor: 'pointer'}}
                      >
                        <td>{sorteo.id}</td>
                        <td>{sorteo.nombre || 'Sin nombre'}</td>
                        <td>{sorteo.descripcion || '-'}</td>
                        <td>
                          {new Date (sorteo.fecha_hora).toLocaleString ()}
                        </td>
                        <td>
                          {sorteo.fecha_programada
                            ? new Date (
                                sorteo.fecha_programada
                              ).toLocaleString ()
                            : ''}
                        </td>
                        <td>{sorteo.provincia || '-'}</td>
                        <td>{sorteo.localidad || '-'}</td>
                        <td>
                          {sorteo.premios && sorteos[0].premios
                            ? sorteos[0].premios
                                .map (
                                  p => `${p.premio.nombre} (x${p.cantidad})`
                                )
                                .join (', ')
                            : 'Sin premios'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              : <p>No se encontraron registros de sorteos.</p>}
      </div>

      <hr />

      {/* Registro de Actividades */}
      <h3>Registro de Actividades</h3>
      <div className="registro-section">
        {cargandoActividad
          ? <ClipLoader size={50} color="#123abc" />
          : <ul className="actividad-list">
              {actividad.map (act => (
                <li key={act.id}>
                  {new Date (act.fecha_hora).toLocaleString ()} - {act.evento}
                </li>
              ))}
            </ul>}
      </div>
    </div>
  );
}

export default Registro;
