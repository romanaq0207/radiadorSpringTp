import React, { useState } from "react";
import Navbar from "../components/NavBar";
import "./Reports.css";

function Reports() {
  const [reportType, setReportType] = useState("");
  const [filtersCompleted, setFiltersCompleted] = useState(false);

  
  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
    setFiltersCompleted(false); 
  };

  const checkFiltersCompleted = () => {
 
    setFiltersCompleted(true);
  };

  return (
    <div className="reportes-container">
      <Navbar />
      <h2 className="title">Reportes</h2>
      
      <div className="filter-section">
        <label htmlFor="reportType">Generar reporte de:</label>
        <select
          id="reportType"
          value={reportType}
          onChange={handleReportTypeChange}
        >
          <option value="">Selecciona una opción</option>
          <option value="vehiculos">Vehículos</option>
          <option value="conductor">Conductores</option>
          <option value="mecanico">Mecánicos</option>
          <option value="gastos">Gastos</option>
          <option value="stock">Stock</option>
        </select>
      </div>

    
      {reportType === "vehiculos" && (
        <div className="filter-fields">
          <label>Filtrar por tipo de vehículos:</label>
          <select
          id="vehiculoType"
          value={reportType}
          onChange={checkFiltersCompleted}
        >
          <option value="">Selecciona una opción</option>
          <option value="autos">Autos</option>
          <option value="camiones">Camiones</option>
          <option value="micros">Micros</option>
          <option value="camioneta">Camionetas</option>
          <option value="moto">Motos</option>
          <option value="todos">Todos</option>

        </select>
        <label>Filtrar por disponibilidad:</label>
        <select
          id="disponibilidad"
          value={reportType}
          onChange={checkFiltersCompleted}
        >
          <option value="">Selecciona una opción</option>
          <option value="reservados">Reservados</option>
          <option value="no reservados">No reservados</option>
          <option value="Indistinto">Indistinto</option>

        </select>
        <label>Desde:</label>
        <input type="date" placeholder="Fecha desde" onChange={checkFiltersCompleted} />
        <label>Hasta:</label>
        <input type="date" placeholder="Fecha hasta" onChange={checkFiltersCompleted} />

        </div>
      )}

      {reportType === "conductor" && (
        <div className="filter-fields">
          <label>Filtrar por nombre del conductor:</label>
          <input type="text" placeholder="Ingrese el nombre" onChange={checkFiltersCompleted} />
        </div>
      )}

      {reportType === "mecanico" && (
        <div className="filter-fields">
          <label>Filtrar por especialidad del mecánico:</label>
          <select
          id="mecanicoType"
          value={reportType}
          onChange={checkFiltersCompleted}
        >
          <option value="">Selecciona una opción</option>
          <option value="electromecanica">Electromecanica</option>
          <option value="frenos">Frenos</option>
          <option value="mecanica general">Mecanica general</option>
          <option value="suspension">Suspension</option>
          <option value="transmision">Transmision</option>
          <option value="gas">Gas</option>
          <option value="cambio de correa">Cambio de correa</option>
          <option value="todos">Todos</option>

        </select>
        </div>
      )}

      {reportType === "gastos" && (
        <div className="filter-fields">
          <label>Filtrar por fecha:</label>
          <input type="date" placeholder="Fecha desde" onChange={checkFiltersCompleted} />
          <input type="date" placeholder="Fecha hasta" onChange={checkFiltersCompleted} />
        </div>
      )}

      {reportType === "stock" && (
        <div className="filter-fields">
          <label>Filtrar por categoría de stock:</label>
          <input type="text" placeholder="Ingrese la categoría" onChange={checkFiltersCompleted} />
        </div>
      )}

      
      {filtersCompleted && (
        <div className="generate-report">
          <button onClick={() => alert("Generando PDF...")}>Generar Reporte PDF</button>
        </div>
      )}
    </div>
  );
}

export default Reports;
