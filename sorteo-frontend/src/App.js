// sorteo-frontend/src/App.js

import React from 'react';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Header from './Header';
import Home from './components/Home';
import Sorteo from './components/Sorteo';
import PremioManager from './components/PremioManager';
import UploadCSV from './components/UploadCSV';
import Registro from './components/Registro';
import ListasCargadas from './components/ListasCargadas';
import AddToBlacklist from './components/AddToBlacklist';
import AdminRedirect from './components/AdminRedirect';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App () {
  return (
    <Router>
      <Header />
      <div>
        {/* Navegación Principal */}
        <nav>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/sorteo">Sorteo</Link></li>
            <li><Link to="/premios">Premios</Link></li>
            <li><Link to="/upload-csv">Subir bases</Link></li>
            <li><Link to="/registro">Registro</Link></li>
            <li><Link to="/listas">Listas Cargadas</Link></li>
            <li><Link to="/blacklist/add">Agregar a Lista Negra</Link></li>
            <li><Link to="/admin">Admin</Link></li>
          </ul>
        </nav>
        <hr />
        {/* Rutas de la Aplicación */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sorteo" element={<Sorteo />} />
          <Route path="/premios" element={<PremioManager />} />
          <Route path="/upload-csv" element={<UploadCSV />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/listas" element={<ListasCargadas />} />
          <Route path="/blacklist/add" element={<AddToBlacklist />} />
          <Route path="/admin" element={<AdminRedirect />} />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
