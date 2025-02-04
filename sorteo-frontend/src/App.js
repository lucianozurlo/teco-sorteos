// App.js
import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from './Header';
import Sorteo from './components/Sorteo';
import Premios from './components/Premios';
import Registro from './components/Registro';
import Bases from './components/Bases';
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
          <Route path="/" element={<Sorteo />} />
          <Route path="/premios" element={<Premios />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/bases" element={<Bases />} />
          <Route path="/admin" element={<AdminRedirect />} />
        </Routes>
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;
