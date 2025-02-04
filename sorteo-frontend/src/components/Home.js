// sorteo-frontend/src/components/Home.js

import React from 'react';
import {Link} from 'react-router-dom';

function Home () {
  return (
    <div>
      <h1>Bienvenido al Sistema de Sorteos</h1>
      <ul>
        <li><Link to="/sorteo">Realizar Sorteo</Link></li>
        <li><Link to="/premios">Premios</Link></li>
        <li><Link to="/upload-csv">Subir bases</Link></li>
        <li><Link to="/registro">Registro</Link></li>
        <li><Link to="/admin">Admin</Link></li>
      </ul>
    </div>
  );
}

export default Home;
