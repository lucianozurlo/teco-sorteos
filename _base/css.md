/* sorteo-frontend/src/Header.css */

header {
    background-color: var(--neutral-bg);
    padding: 16px 32px;
    margin-bottom: 24px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
}

.header-logo {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--primary-color);
}

.nav-links {
    display: flex;
    gap: 15px;
    list-style: none;
    margin: 0;
    padding: 0;
    font-family: var(--font-family);
}

.nav-links li {
    display: inline;
}

.nav-links a {
    display: block;
    padding: 8px 12px;
    font-weight: 500;
    background-color: transparent;
    color: var(--text-color);
    border-radius: 4px;
    text-decoration: none;
    transition: all 0.3s ease;
}

.nav-links a:hover {
    color: var(--primary-color);
    background-color: transparent;
}

.nav-links a.active {
    background-color: var(--primary-color);
    color: #fff;
}

.nav-links a:hover.active {
    background-color: var(--primary-dark);
    color: #fff;
}

@media (max-width: 768px) {
    .header-inner {
        flex-direction: column;
        align-items: flex-start;
    }

    .nav-links {
        width: 100%;
        flex-direction: column;
        margin-top: 10px;
    }

    .nav-links a {
        width: 100%;
        text-align: center;
    }
}



/* sorteo-frontend/src/index.css */

:root {
    --primary-color: #3c00a0;
    --primary-light: #6428fb;
    --primary-dark: #28096a;
    --neutral-bg: #fff;
    --neutral-border: #ddd;
    --neutral-disabled: #aaa;
    --text-color: #333;
    --font-family: 'Roboto', Arial, sans-serif;
    --base-padding: 16px;
    --base-margin: 16px;
  }
  
  /* @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap'); */
  
  * {
    box-sizing: border-box;
  }
  
  #root {
    margin-bottom: 100px;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: var(--font-family);
    background-color: #eef1f5;
    color: var(--text-color);
    line-height: 1.6;
  }
  
  a {
    text-decoration: none;
    color: var(--primary-color);
    transition: color 0.3s ease;
  }
  
  a:hover {
    color: var(--primary-hover);
  }
  
  hr {
    border: unset;
    border-bottom: 1px dotted #aaa;
  }
  
  /* Header Profesional */
  header {
    background-color: #fff;
    padding: var(--base-padding) calc(var(--base-padding) * 2);
    margin-bottom: var(--base-margin);
    border-bottom: 2px solid var(--neutral-border);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .header-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  
  .header-logo {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-color);
  }
  
  .nav-links {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  .nav-links li {
    margin: 0;
  }
  
  .nav-links a {
    display: block;
    padding: 10px 15px;
    font-weight: 500;
    color: var(--text-color);
    border-radius: 6px;
    transition: background-color 0.3s ease, color 0.3s ease;
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    -ms-border-radius: 6px;
    -o-border-radius: 6px;
  }
  
  .nav-links a:hover {
    background-color: var(--primary-color);
    color: #fff;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--base-padding);
  }
  
  button {
    background-color: var(--primary-color);
    border-radius: 8px;
    border-style: none;
    box-shadow: rgba(255, 255, 255, 0.26) 0 1px 2px inset;
    box-sizing: border-box;
    color: #fff;
    cursor: pointer;
    font-size: 100%;
    line-height: 1.15;
    margin: 0;
    padding: 10px 21px;
    text-align: center;
    text-transform: none;
    transition: all .25s ease-in-out;
    user-select: none;
    -webkit-user-select: none;
    -webkit-transition: all .25s ease-in-out;
    -moz-transition: all .25s ease-in-out;
    -ms-transition: all .25s ease-in-out;
    -o-transition: all .25s ease-in-out;
  }
  
  button:active {
    background-color: var(--primary-light);
  }
  
  button:hover {
    background-color: var(--primary-dark) !important;
  }
  
  button.ejecutar {
    background-color: var(--primary-light);
    padding: 15px 25px;
    font-size: 1.2rem;
    margin-top: 0;
    margin-bottom: 25px;
    width: 100%;
  }
  
  button.eliminar {
    background-color: red !important;
  }
  
  button:hover.eliminar {
    background-color: darkred !important;
  }
  
  input,
  select {
    font-size: .9rem !important;
    border: 1px solid var(--neutral-border);
    border-radius: 4px;
    font-size: .9rem;
    max-width: 300px;
    padding: 10px !important;
    width: 100%;
  }
  
  h1 {
    margin-top: 0;
  }
  
  h2,
  h3 {
    color: var(--primary-dark);
    font-size: 1.7rem;
    font-weight: 600;
    margin: 10px auto 35px;
  }
  
  h3 {
    font-size: 1.5rem;
    font-weight: 400;
    margin-bottom: 20px;
  }
  
  h4 {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 1.1rem;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: var(--base-margin);
    margin-bottom: 24px;
    background-color: var(--neutral-bg);
    font-size: 0.95rem;
  }
  
  table th,
  table td {
    border: 1px solid var(--neutral-border);
    padding: 12px 15px;
    text-align: left;
  }
  
  table th {
    background-color: #f2f2f2;
    font-weight: 600;
  }
  
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 24px;
    background-color: var(--neutral-bg);
    font-size: 0.95rem;
  }
  
  table th,
  table td {
    border: 1px solid var(--neutral-border);
    padding: 12px 15px;
    text-align: left;
  }
  
  table th {
    background-color: #f2f2f2;
    font-weight: 600;
  }
  
  .d-flex {
    display: flex !important;
  }
  
  @media (max-width: 768px) {
    .nav-links {
      flex-direction: column;
      align-items: flex-start;
    }
  }
  
  @media (max-width: 600px) {
  
    .container,
    header,
    .add-to-blacklist-container,
    .registro-container,
    .listas-container,
    .premios-container,
    .sorteo-container,
    .upload-csv-container {
      padding: 16px;
      margin: 12px;
    }
  
    table {
      display: block;
      overflow-x: auto;
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
  
    table th,
    table td {
      border: 1px solid var(--neutral-border);
      padding: 12px 15px;
      font-size: 0.95rem;
    }
  
    table th {
      background-color: #f2f2f2;
      font-weight: 600;
    }
  
  
    header .header-logo {
      font-size: 1.3rem;
    }
  
    .nav-links a {
      padding: 8px 10px;
      font-size: 0.9rem;
    }
  }



/* sorteo-frontend/src/components/AddToBlacklist.css */

.add-to-blacklist-container {
    padding: 1.5rem;
    border-radius: 8px;
    max-width: 600px;
    margin: 20px auto;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .add-to-blacklist-container h3 {
    margin-bottom: 16px;
    font-size: 1.25rem;
    color: var(--primary-dark);
  }
  
  .add-to-blacklist-container input {
    width: calc(100% - 140px);
    padding: 10px;
    margin-right: 10px;
    border: 1px solid var(--neutral-border);
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .add-to-blacklist-container button {
    padding: 10px 16px;
    background-color: var(--primary-color);
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-size: 1rem;
  }
  
  .add-to-blacklist-container button:hover {
    background-color: var(--primary-light);
  }




/* sorteo-frontend/src/components/Bases.css */

.bases-container {
    background-color: var(--neutral-bg);
    padding: 24px;
    margin: 24px auto;
    max-width: 1200px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-family: var(--font-family);
  }
  
  .bases-container table {
    min-width: 100%;
  }
  
  .bases-container table th:first-child {
    text-align: right;
  }
  
  .bases-container table td {
    padding: 6px 10px;
  }
  
  /* Pestañas */
  .tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    justify-content: flex-start;
  }
  
  .tab {
    padding: 10px 16px;
    border: 1px solid var(--primary-color);
    background-color: var(--neutral-bg);
    color: var(--primary-color);
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  
  .tab:hover {
    background-color: var(--primary-color);
    color: #fff;
  }
  
  .tab.active {
    background-color: var(--primary-dark);
    color: #fff;
  }
  
  /* Sección de listados */
  .list-section {
    margin-top: 16px;
  }
  
  /* Paginación */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-top: 16px;
  }
  
  .pagination button {
    padding: 8px 16px;
    background-color: var(--primary-color);
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .pagination button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .pagination button:hover:not(:disabled) {
    background-color: var(--primary-light);
  }
  
  .pagination span {
    font-size: 1rem;
    color: var(--text-color);
  }
  
  /* Sección de cargar bases */
  .cargar-section {
    display: flex;
    flex-direction: row;
    gap: 32px;
  }
  
  .cargar-section .cargar-item:first-child {
    width: 60%;
  }
  
  .cargar-section .cargar-item:last-child {
    width: 40%;
  }
  
  /* Responsividad */
  @media (max-width: 600px) {
    .bases-container {
      padding: 16px;
      margin: 16px;
    }
  
    table {
      display: block;
      overflow-x: auto;
    }
  
    .tabs {
      flex-direction: column;
      align-items: center;
    }
  }




/* sorteo-frontend/src/components/Premios.css */

.premios-container {
    background-color: var(--neutral-bg);
    padding: 24px;
    margin: 24px auto;
    max-width: 800px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.premios-section {
    margin-bottom: 32px;
}

.premios-section h3 {
    margin-bottom: 16px;
    font-size: 1.2rem;
    color: var(--primary-dark);
}

.premios-section input {
    padding: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
    width: 200px;
    border: 1px solid var(--neutral-border);
    border-radius: 4px;
    font-size: 1rem;
}

.premios-section button {
    margin-right: 8px;
}

.premios-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 24px;
}

.premios-table th,
.premios-table td {
    border: 1px solid var(--neutral-border);
    padding: 12px 15px;
    font-size: 0.95rem;
    text-align: left;
}

.premios-table th {
    background-color: #f2f2f2;
    font-weight: 600;
}

.premios-table th:nth-child(1),
.premios-table td:nth-child(1) {
    width: 55%;
}

.premios-table th:nth-child(2),
.premios-table td:nth-child(2) {
    width: 10%;
    text-align: center;
}

.premios-table th:nth-child(3),
.premios-table td:nth-child(3) {
    width: 35%;
}

.premios-table td:nth-child(3) button {
    margin: 5px;
}




/* sorteo-frontend/src/components/Registro.css */

.registro-container {
    background-color: var(--neutral-bg);
    padding: 24px;
    margin: 24px auto;
    max-width: 1000px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.registro-container hr {
    margin-bottom: 20px;
}

.registro-section {
    margin-bottom: 32px;
}

.registro-section h3 {
    margin-bottom: 16px;
    font-size: 1.2rem;
    color: var(--primary-dark);
}

.filtros-container {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end !important;
    gap: 16px;
    margin: 20px 0;
}

.filtro {
    width: 18%;
}

.filtro label {
    font-weight: 600;
    margin-right: 8px;
    color: var(--primary-color);
}

.filtro input,
.filtro select {
    padding: 8px;
    border: 1px solid var(--neutral-border);
    border-radius: 4px;
    font-size: 0.95rem;
}




/* sorteo-frontend/src/components/Sorteo.css */

.sorteo-container {
    background-color: var(--neutral-bg);
    padding: 24px;
    margin: 24px auto;
    max-width: 800px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sorteo-section {
    margin-bottom: 20px;
}

.sorteo-section label {
    display: block;
    margin-bottom: 8px;
    margin-top: 20px;
    font-weight: 600;
    font-size: 1rem;
    color: var(--primary-color);
}

.sorteo-section input,
.sorteo-section select {
    padding: 0 10px;
    width: 100%;
    max-width: 300px;
    border: 1px solid var(--neutral-border);
    border-radius: 4px;
    font-size: .9rem;
}

.sorteo-section label input {
    margin-right: 10px;
    width: unset;
}

.sorteo-section .half {
    width: 41%;
    margin-right: 8px;
}

.sorteo-section .half:last-child {
    margin-right: 0;
}

.sorteo-section .half label {
    margin-bottom: 0;
}

.sorteo-section h4 {
    margin-top: 30px;
}

.sortear {
    margin-top: 30px;
}

.sorteo-list {
    list-style: none;
    padding: 0;
    margin-top: 16px;
}

.sorteo-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    margin-bottom: 10px;
    border: 1px solid var(--neutral-border);
    border-radius: 4px;
    background-color: var(--neutral-bg);
    font-size: 0.95rem;
}

.eliminar-btn {
    padding: 6px 12px;
    background-color: var(--danger-color);
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-size: 0.9rem;
}

.eliminar-btn:hover {
    background-color: var(--danger-hover);
}

.sorteo-result {
    margin-top: 20px;
    padding: 20px 30px 10px;
    border: 2px solid var(--success-color);
    border-radius: 4px;
    background-color: #e9ffe9;
    font-size: 1rem;
    color: var(--text-color);
}

.sorteo-result h2 {
    margin-top: 0;
}




/* sorteo-frontend/src/components/UploadCSV.css */

.upload-csv-container {
    background-color: var(--neutral-bg);
    padding: 24px;
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-family: var(--font-family);
}

.dropzone {
    border: 2px dashed var(--neutral-disabled);
    border-radius: 5px;
    padding: 20px;
    text-align: center;
    color: var(--neutral-disabled);
    transition: border-color 0.3s ease, background-color 0.3s ease;
    margin-bottom: 20px;
}

.dropzone.active {
    border-color: var(--primary-color);
    background-color: #f0f8ff;
    color: var(--primary-dark);
}

.upload-button {
    padding: 12px 20px;
    background-color: var(--success-color);
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;
}

.upload-button:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
}

.mensaje {
    margin-top: 20px;
    font-weight: bold;
    text-align: center;
}

.descargar-plantillas {
    margin-top: 16px;
}

.descargar-plantillas .btn {
    display: inline-block;
    margin-top: 0;
    padding: 8px 16px;
    background-color: var(--primary-color);
    color: #fff;
    text-decoration: none;
    border-radius: 4px;
    transition: background-color 0.3s ease;
    font-size: 0.95rem;
}

.descargar-plantillas .btn:hover {
    background-color: var(--primary-light);
}