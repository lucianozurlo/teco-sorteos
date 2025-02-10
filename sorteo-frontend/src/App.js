// sorteo-frontend/src/App.js

import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from './Header';
import Sorteo from './components/Sorteo';
import SorteoDetalle from './components/SorteoDetalle';
import Premios from './components/Premios';
import Registro from './components/Registro';
import RegistrosSnapshot from './components/RegistrosSnapshot';
import Bases from './components/Bases';
import ScheduledSorteos from './components/ScheduledSorteos';
import AdminRedirect from './components/AdminRedirect';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App () {
  return (
    <Router>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Sorteo />} />
          <Route path="/premios" element={<Premios />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/detalle-sorteo/:id" element={<SorteoDetalle />} />
          <Route path="/registros-sorteos" element={<RegistrosSnapshot />} />
          <Route path="/bases" element={<Bases />} />
          <Route path="/scheduled" element={<ScheduledSorteos />} />
          <Route path="/admin" element={<AdminRedirect />} />
        </Routes>
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;
