// sorteo-frontend/src/components/AddToParticipants.js

import React, {useState} from 'react';
import {toast} from 'react-toastify';
import {API_BASE_URL} from '../config';
import './AddToParticipants.css';

function AddToParticipants({onUpdate}) {
  const [legajo, setLegajo] = useState ('');
  const [nombre, setNombre] = useState ('');
  const [apellido, setApellido] = useState ('');
  const [email, setEmail] = useState ('');
  const [area, setArea] = useState ('');
  const [dominio, setDominio] = useState ('');
  const [cargo, setCargo] = useState ('');
  const [localidad, setLocalidad] = useState ('');
  const [provincia, setProvincia] = useState ('');

  const handleAdd = async () => {
    if (!legajo || !nombre.trim () || !apellido.trim () || !email.trim ()) {
      toast.error ('Por favor, completá todos los campos requeridos (*)');
      return;
    }
    const payload = {
      id: legajo,
      nombre: nombre.trim (),
      apellido: apellido.trim (),
      email: email.trim (),
      area: area.trim (),
      dominio: dominio.trim (),
      cargo: cargo.trim (),
      localidad: localidad.trim (),
      provincia: provincia.trim (),
    };

    try {
      const response = await fetch (`${API_BASE_URL}/api/participants/add/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify (payload),
      });
      const data = await response.json ();
      if (response.ok) {
        toast.success (data.message);
        // Limpiar el formulario
        setLegajo ('');
        setNombre ('');
        setApellido ('');
        setEmail ('');
        setArea ('');
        setDominio ('');
        setCargo ('');
        setLocalidad ('');
        setProvincia ('');
        if (onUpdate) onUpdate ();
      } else {
        toast.error (data.error || 'Error al agregar participante.');
      }
    } catch (err) {
      console.error (err);
      toast.error ('Error al agregar participante.');
    }
  };

  return (
    <div className="add-to-participants-container">
      <h4>Participante</h4>
      <div className="input-row">
        <div className="form-group">
          <label>Legajo *:</label>
          <input
            type="number"
            value={legajo}
            onChange={e => setLegajo (e.target.value)}
            placeholder="Legajo"
          />
        </div>
        <div className="form-group">
          <label>Nombre *:</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre (e.target.value)}
            placeholder="Nombre"
          />
        </div>
        <div className="form-group">
          <label>Apellido *:</label>
          <input
            type="text"
            value={apellido}
            onChange={e => setApellido (e.target.value)}
            placeholder="Apellido"
          />
        </div>
      </div>
      <div className="input-row">
        <div className="form-group">
          <label>Área:</label>
          <input
            type="text"
            value={area}
            onChange={e => setArea (e.target.value)}
            placeholder="Área"
          />
        </div>
        <div className="form-group">
          <label>Dominio:</label>
          <input
            type="text"
            value={dominio}
            onChange={e => setDominio (e.target.value)}
            placeholder="Dominio"
          />
        </div>
      </div>
      <div className="input-row">
        <div className="form-group">
          <label>Cargo:</label>
          <input
            type="text"
            value={cargo}
            onChange={e => setCargo (e.target.value)}
            placeholder="Cargo"
          />
        </div>
        <div className="form-group">
          <label>Email *:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail (e.target.value)}
            placeholder="Email"
          />
        </div>
      </div>
      <div className="input-row">
        <div className="form-group">
          <label>Localidad:</label>
          <input
            type="text"
            value={localidad}
            onChange={e => setLocalidad (e.target.value)}
            placeholder="Localidad"
          />
        </div>
        <div className="form-group">
          <label>Provincia:</label>
          <input
            type="text"
            value={provincia}
            onChange={e => setProvincia (e.target.value)}
            placeholder="Provincia"
          />
        </div>
      </div>
      <div className="input-row">
        <button onClick={handleAdd}>Agregar Participante</button>
        <p className="mandatory-note">(*) Campos obligatorios</p>
      </div>
    </div>
  );
}

export default AddToParticipants;
