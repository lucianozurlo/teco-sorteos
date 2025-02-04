// sorteo-frontend/src/components/AdminRedirect.js
import React, {useEffect} from 'react';
import {ADMIN_URL} from '../config';

const AdminRedirect = () => {
  useEffect (() => {
    // Redirige inmediatamente a la URL de administración
    window.location.href = ADMIN_URL;
  }, []);

  return (
    <div>
      Redirigiendo...
    </div>
  );
};

export default AdminRedirect;
