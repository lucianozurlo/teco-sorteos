// Header.js
import React from 'react';
import {NavLink} from 'react-router-dom';
import './Header.css';

function Header () {
  return (
    <header>
      <div className="header-inner">
        <div className="header-logo">
          Mi App de Sorteos
        </div>
        <ul className="nav-links">
          <li><NavLink to="/sorteo">Sorteo</NavLink></li>
          <li><NavLink to="/premios">Premios</NavLink></li>
          <li><NavLink to="/registro">Registro</NavLink></li>
          <li><NavLink to="/bases">Bases</NavLink></li>
          <li><NavLink to="/blacklist/add">Agregar a Lista Negra</NavLink></li>
          <li>
            <a href="/admin" target="_blank" rel="noopener noreferrer">
              Admin
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
