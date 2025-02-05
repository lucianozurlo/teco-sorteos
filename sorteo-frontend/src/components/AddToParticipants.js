// sorteo-frontend/src/components/AddToParticipants.js

import React, {useState} from 'react';
import {toast} from 'react-toastify';
import {API_BASE_URL} from '../config';
import './AddToParticipants.css';

function AddToParticipants () {
  const [formData, setFormData] = useState ({
    id: '',
    nombre: '',
    apellido: '',
    email: '',
    area: '',
    dominio: '',
    cargo: '',
    localidad: '',
    provincia: '',
  });

  const handleChange = e => {
    setFormData ({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAdd = async () => {
    // Verificar que los campos obligatorios estén completos
    const {id, nombre, apellido, email} = formData;
    if (!id || !nombre || !apellido || !email) {
      toast.error ('Legajo, Nombre, Apellido y Email son obligatorios.');
      return;
    }
    try {
      const response = await fetch (`${API_BASE_URL}/api/participants/add/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify (formData),
      });
      const data = await response.json ();
      if (response.ok) {
        toast.success (data.message);
        // Reinicia el formulario
        setFormData ({
          id: '',
          nombre: '',
          apellido: '',
          email: '',
          area: '',
          dominio: '',
          cargo: '',
          localidad: '',
          provincia: '',
        });
      } else {
        toast.error (data.error || 'Error al agregar participante.');
      }
    } catch (error) {
      console.error (error);
      toast.error ('Error al conectar con la API.');
    }
  };

  return (
    <div className="add-to-participants-container">
      <h4>Agregar participante</h4>
      <div className="rows">
        <input
          type="number"
          name="id"
          placeholder="Legajo"
          value={formData.id}
          onChange={handleChange}
        />
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={formData.apellido}
          onChange={handleChange}
        />
      </div>
      <div className="rows">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="cargo"
          placeholder="Cargo"
          value={formData.cargo}
          onChange={handleChange}
        />
      </div>
      <div className="rows">
        <input
          type="text"
          name="area"
          placeholder="Área"
          value={formData.area}
          onChange={handleChange}
        />
        <input
          type="text"
          name="dominio"
          placeholder="Dominio"
          value={formData.dominio}
          onChange={handleChange}
        />
      </div>
      <div className="rows">
        <input
          type="text"
          name="localidad"
          placeholder="Localidad"
          value={formData.localidad}
          onChange={handleChange}
        />
        <input
          type="text"
          name="provincia"
          placeholder="Provincia"
          value={formData.provincia}
          onChange={handleChange}
        />
      </div>
      <button onClick={handleAdd}>Agregar Participante</button>
    </div>
  );
}

export default AddToParticipants;
