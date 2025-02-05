// AdminRedirect.js
import React, {useEffect} from 'react';
import {ADMIN_URL} from '../config';

const AdminRedirect = () => {
  useEffect (() => {
    // Abre la URL en una nueva ventana
    window.open (ADMIN_URL, '_blank', 'noopener,noreferrer');
  }, []);

  return (
    <div>
      Redirigiendo...
    </div>
  );
};

export default AdminRedirect;
