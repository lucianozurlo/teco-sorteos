// sorteo-frontend/src/components/AddToBlacklist.js

import React, {useState} from 'react';
import {toast} from 'react-toastify';
import {API_BASE_URL} from '../config';
import './AddToBlacklist.css';

function AddToBlacklist({onUpdate}) {
  const [participantId, setParticipantId] = useState ('');

  const handleAdd = async () => {
    if (!participantId) {
      toast.error ('Por favor, ingresá un legajo.');
      return;
    }
    try {
      const response = await fetch (`${API_BASE_URL}/api/blacklist/add/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify ({id: participantId}),
      });
      const data = await response.json ();
      if (response.ok) {
        toast.success (data.message);
        setParticipantId ('');
        if (onUpdate) onUpdate ();
      } else {
        toast.error (data.error || 'Error al agregar a la lista.');
      }
    } catch (err) {
      console.error (err);
      toast.error ('Error al agregar a la lista.');
    }
  };

  return (
    <div className="add-to-blacklist-container">
      <h4>Lista de participantes no incluidos</h4>
      <input
        type="number"
        value={participantId}
        onChange={e => setParticipantId (e.target.value)}
        placeholder="Legajo del participante"
      />
      <button onClick={handleAdd}>Agregar</button>
    </div>
  );
}

export default AddToBlacklist;
