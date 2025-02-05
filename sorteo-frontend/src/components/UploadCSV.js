// sorteo-frontend/src/components/UploadCSV.js

import React, {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {toast} from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import {API_BASE_URL} from '../config';
import './UploadCSV.css';

function UploadCSV () {
  const [fileUsuarios, setFileUsuarios] = useState (null);
  const [fileListaNegra, setFileListaNegra] = useState (null);
  const [cargando, setCargando] = useState (false);

  const onDropUsuarios = useCallback (acceptedFiles => {
    const file = acceptedFiles[0];
    if (file && file.type === 'text/csv') {
      setFileUsuarios (file);
      toast.success (
        `Listado de participantes "${file.name}" cargado correctamente.`
      );
    } else {
      toast.error ('Por favor, subí un archivo CSV válido para participantes.');
    }
  }, []);

  const onDropListaNegra = useCallback (acceptedFiles => {
    const file = acceptedFiles[0];
    if (file && file.type === 'text/csv') {
      setFileListaNegra (file);
      toast.success (
        `Listado de participantes no incluidos "${file.name}" cargado correctamente.`
      );
    } else {
      toast.error ('Por favor, subí un archivo CSV válido.');
    }
  }, []);

  const {
    getRootProps: getRootPropsUsuarios,
    getInputProps: getInputPropsUsuarios,
    isDragActive: isDragActiveUsuarios,
  } = useDropzone ({onDrop: onDropUsuarios, accept: {'text/csv': ['.csv']}});

  const {
    getRootProps: getRootPropsListaNegra,
    getInputProps: getInputPropsListaNegra,
    isDragActive: isDragActiveListaNegra,
  } = useDropzone ({onDrop: onDropListaNegra, accept: {'text/csv': ['.csv']}});

  const handleUpload = async () => {
    if (!fileUsuarios && !fileListaNegra) {
      toast.error ('Por favor, arrastrá al menos un archivo.');
      return;
    }
    setCargando (true);
    try {
      const formData = new FormData ();
      if (fileUsuarios) {
        formData.append ('usuarios', fileUsuarios);
      }
      if (fileListaNegra) {
        formData.append ('lista_negra', fileListaNegra);
      }
      const response = await fetch (`${API_BASE_URL}/api/upload_csv/`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json ();
      if (response.ok) {
        toast.success (data.usuarios ? data.usuarios : data.lista_negra);
        setFileUsuarios (null);
        setFileListaNegra (null);
      } else {
        toast.error (data.error || 'Error al subir CSV');
      }
    } catch (err) {
      console.error (err);
      toast.error ('Error al subir CSV.');
    } finally {
      setCargando (false);
    }
  };

  return (
    <div className="upload-csv-container">
      <h4>Cargar archivos CSV</h4>
      <div className="dropzone-container">
        <div
          {...getRootPropsUsuarios ()}
          className={`dropzone ${isDragActiveUsuarios ? 'active' : ''}`}
        >
          <input {...getInputPropsUsuarios ()} />
          {fileUsuarios
            ? <p>{fileUsuarios.name}</p>
            : <p>
                Arrastrá el archivo CSV de participantes o hacé clic para seleccionarlo
              </p>}
        </div>
        <div
          {...getRootPropsListaNegra ()}
          className={`dropzone ${isDragActiveListaNegra ? 'active' : ''}`}
        >
          <input {...getInputPropsListaNegra ()} />
          {fileListaNegra
            ? <p>{fileListaNegra.name}</p>
            : <p>
                Arrastrá el archivo CSV de usuarios que no participarán de los sorteos o hacé clic para seleccionarlo
              </p>}
        </div>
      </div>
      <button
        onClick={handleUpload}
        className="upload-button"
        disabled={cargando}
      >
        {cargando ? <ClipLoader size={20} color="#ffffff" /> : 'Subir CSV'}
      </button>
      <div className="descargar-plantillas" style={{marginTop: '1rem'}}>
        <h4>Descargar Plantillas de ejemplo</h4>
        <a
          href={`${API_BASE_URL}/api/download_template/participantes/`}
          download="participantes_template.csv"
          className="btn"
        >
          Participantes
        </a>
        <a
          href={`${API_BASE_URL}/api/download_template/lista_negra/`}
          download="lista_negra_template.csv"
          className="btn"
          style={{marginLeft: '1rem'}}
        >
          Participantes no incluidos
        </a>
      </div>
    </div>
  );
}

export default UploadCSV;
