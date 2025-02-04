// sorteo-frontend/src/Header.js
import React from 'react';
import {Link} from 'react-router-dom';
import './Header.css'; // Opcional, si deseas estilos específicos para el header

function Header () {
  return (
    <header>
      <div className="header-inner container">
        <div className="header-logo">
          Sorteos CI
        </div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/sorteo">Sorteo</Link></li>
          <li><Link to="/premios">Premios</Link></li>
          <li><Link to="/upload-csv">Subir bases</Link></li>
          <li><Link to="/historico">Registro</Link></li>
          <li><Link to="/listas">Listas Cargadas</Link></li>
          <li><Link to="/blacklist/add">Agregar a Lista Negra</Link></li>
          <li><Link to="/admin">Admin</Link></li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
