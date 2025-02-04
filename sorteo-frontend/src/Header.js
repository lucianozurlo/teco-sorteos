// Header.js
import React from 'react';
import {NavLink} from 'react-router-dom';
import './Header.css';

function Header () {
  return (
    <header>
      <div className="header-inner">
        <div className="header-logo">
          Teco Sorteos
        </div>
        <ul className="nav-links">
          {/* Usamos NavLink para que asigne automáticamente la clase "active" */}
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/sorteo">Sorteo</NavLink></li>
          <li><NavLink to="/premios">Premios</NavLink></li>
          <li><NavLink to="/upload-csv">Subir bases</NavLink></li>
          <li><NavLink to="/registro">Registro</NavLink></li>
          <li><NavLink to="/listas">Listas Cargadas</NavLink></li>
          <li><NavLink to="/blacklist/add">Agregar a Lista Negra</NavLink></li>
          <li><NavLink to="/admin">Admin</NavLink></li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
