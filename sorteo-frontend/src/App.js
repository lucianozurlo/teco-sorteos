// sorteo-frontend/src/App.js

import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from './Header';
import Home from './components/Home';
import Sorteo from './components/Sorteo';
import PremioManager from './components/PremioManager';
import UploadCSV from './components/UploadCSV';
import Historico from './components/Historico';
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
      <div className="container">
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
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;
