/* sorteo-frontend/src/components/AddToBlacklist.css */

.add-to-blacklist-container {
  padding: 1.5rem;
  border-radius: 8px;
  width: 100%;
  margin: 20px auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: var(--neutral-bg);
}

.add-to-blacklist-container h4 {
  margin-top: -5px;
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



/* sorteo-frontend/src/components/UploadCSV.css */

.upload-csv-container {
    background-color: var(--neutral-bg);
    padding: 24px;
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-family: var(--font-family);
}

.upload-csv-container h4 {
    margin-top: -5px;
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
    -webkit-transition: background-color 0.3s ease;
    -moz-transition: background-color 0.3s ease;
    -ms-transition: background-color 0.3s ease;
    -o-transition: background-color 0.3s ease;
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



/* sorteo-frontend/src/components/Sorteo.css */

.sorteo-container {
    background-color: var(--neutral-bg);
    padding: 24px;
    margin: 24px auto;
    max-width: 800px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sorteo-container hr {
    margin: 22px 0;
}

.sorteo-header {
    display: flex;
    gap: 10px;
    align-items: center;
}

.sorteo-header .sorteo-input-group {
    width: 50%;
}

.sorteo-header .sorteo-input-group input {
    max-width: unset;
}

.sorteo-field {
    flex: 1;
}

.sorteo-field label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    font-size: 1rem;
    color: var(--primary-color);
}

.sorteo-field input {
    width: 100%;
    padding: 0 10px;
    border: 1px solid var(--neutral-border);
    border-radius: 4px;
    font-size: 0.9rem;
}

.sorteo-options {
    display: flex;
    gap: 20px;
    align-items: center;
    margin-bottom: 10px;
}

.sorteo-options label {
    font-size: 0.95rem;
    color: var(--text-color);
}

.sorteo-section {
    margin-bottom: 20px;
}

.sorteo-header label,
.sorteo-section label {
    display: block;
    margin-bottom: 8px;
    margin-top: 0;
    font-weight: 600;
    font-size: 1rem;
    color: var(--primary-color);
}

label.check {
    margin-bottom: 15px;
}

.sorteo-section.subsection {
    margin-left: 29px;
}

.sorteo-section.subsection label {
    font-size: .9rem;
    color: var(--text-color);
    margin-bottom: 0;
}

.sorteo-section .half {
    width: 41%;
}

.sorteo-section .half.bottom {
    display: flex;
    align-items: flex-end;
}

.sorteo-section .half:last-child {
    margin-right: 0;
}

.d-flex {
    display: flex;
    gap: 10px;
}

.sortear {
    margin-top: 30px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.sortear button {
    flex: 1;
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
    margin-bottom: 20px;
    color: darkgreen;
}

/* Estilos para sorteos agendados */
.scheduled-sorteos {
    margin-top: 40px;
    padding: 16px;
    border: 1px solid var(--neutral-border);
    border-radius: 8px;
    background-color: #f9f9f9;
}

.scheduled-sorteos h2 {
    margin-top: 0;
    margin-bottom: 16px;
}

.scheduled-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid var(--neutral-border);
}

.scheduled-item:last-child {
    border-bottom: none;
}

.scheduled-item input[type="datetime-local"] {
    margin-left: 10px;
    padding: 4px;
    border: 1px solid var(--neutral-border);
    border-radius: 4px;
    font-size: 0.9rem;
}

.scheduled-item button {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.scheduled-item button:hover {
    background-color: var(--primary-dark);
}

/* Estilo para botones deshabilitados (para el botón "Realizar sorteo") */
button.ejecutar:disabled {
    pointer-events: none;
    cursor: default;
    background-color: #ccc;
    opacity: 0.8;
}



/* sorteo-frontend/src/components/ScheduledSorteos.css */

.scheduled-container {
  background-color: var(--neutral-bg);
  padding: 24px;
  margin: 24px auto;
  max-width: 1000px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: var(--font-family);
}

.scheduled-container .acciones {
  gap: 8px;
}

.scheduled-container table.text button {
  padding: 8px !important;
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

.filtro input,
.filtro select {
    padding: 8px;
    border: 1px solid var(--neutral-border);
    border-radius: 4px;
    font-size: 0.95rem;
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

.premios-container hr {
    margin: 18px 0 22px;
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
    width: 60%;
}

.premios-table th:nth-child(2),
.premios-table td:nth-child(2) {
    width: 10%;
    text-align: center;
}

.premios-table th:nth-child(3),
.premios-table td:nth-child(3) {
    width: 30%;
    text-align: center;
}



/* sorteo-frontend/src/components/Bases.css */

.container {
  max-width: unset !important;
}

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
  font-size: 0.9rem;
  line-height: 130%;
}

/* Anchos de columnas en porcentaje */
.bases-container table th:nth-child(1),
.bases-container table td:nth-child(1) {
  width: 6.5%;
}

.bases-container table th:nth-child(2),
.bases-container table td:nth-child(2) {
  width: 7.5%;
}

.bases-container table th:nth-child(3),
.bases-container table td:nth-child(3) {
  width: 8%;
}

.bases-container table th:nth-child(4),
.bases-container table td:nth-child(4) {
  width: 10%;
}

.bases-container table th:nth-child(5),
.bases-container table td:nth-child(5) {
  width: 10%;
}

.bases-container table th:nth-child(6),
.bases-container table td:nth-child(6) {
  width: 9.5%;
}

.bases-container table th:nth-child(7),
.bases-container table td:nth-child(7) {
  width: 22%;
}

.bases-container table th:nth-child(8),
.bases-container table td:nth-child(8) {
  width: 8%;
}

.bases-container table th:nth-child(9),
.bases-container table td:nth-child(9) {
  width: 8%;
}

.bases-container table th:nth-child(10),
.bases-container table td:nth-child(10) {
  width: 10.5%;
}

.bases-container table th:last-child,
.bases-container table td:last-child {
  text-align: center;
  margin: 0;
}

.bases-container table td {
  padding: 6px 10px;
}

.bases-container table td:last-child button {
  padding: 10px 16px;
  margin: 0;
}

/* Botones para vaciar listas */
.clear-button-container {
  text-align: right;
  margin-bottom: 8px;
}

.clear-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.clear-button:hover {
  background-color: var(--primary-dark);
}

/* Pestañas */
.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 35px;
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
  margin-top: -50px;
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
  width: 40%;
}

.cargar-section .cargar-item:last-child {
  width: 60%;
}

.cargar-section .cargar-item h3 {
  margin-left: 12px;
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



/* sorteo-frontend/src/components/AddToParticipants.css */

.add-to-participants-container {
    padding: 1.5rem;
    border-radius: 8px;
    width: 100%;
    margin: 20px auto;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: var(--neutral-bg);
}

.add-to-participants-container h4 {
    margin-top: -5px;
}

.input-row {
    display: flex;
    gap: 10px;
}

.input-row:nth-child(2) .form-group {
    width: 39%;
}

.input-row:nth-child(2) .form-group:first-child {
    width: 22%;
}

.form-group {
    margin-bottom: 12px;
    display: flex;
    flex-direction: column;
    width: 100%;
}

.form-group input {
    padding: 10px;
    border: 1px solid var(--neutral-border);
    border-radius: 4px;
    font-size: 1rem;
    max-width: unset;
}

.add-to-participants-container button {
    padding: 10px 16px;
    background-color: var(--primary-color);
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-size: 1rem;
    margin-top: 10px;
}

.add-to-participants-container button:hover {
    background-color: var(--primary-light);
}

.mandatory-note {
    margin: 10px 10px 0;
    font-size: 0.9rem;
    color: var(--neutral-disabled);
    display: flex;
    align-items: center;
}