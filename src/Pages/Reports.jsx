/*import React, { useState } from "react";
import Navbar from "../components/NavBar";
import "./Reports.css";

function Reports() {
  const [reportType, setReportType] = useState("");
  const [vehicleType, setVehicleType] = useState(""); // Estado para vehículos
  const [availability, setAvailability] = useState(""); // Estado para disponibilidad
  const [mechanicSpecialty, setMechanicSpecialty] = useState(""); // Estado para mecánico
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
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)} // Actualiza el estado de vehicleType
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
            value={availability}
            onChange={(e) => setAvailability(e.target.value)} // Actualiza el estado de availability
          >
            <option value="">Selecciona una opción</option>
            <option value="reservados">Reservados</option>
            <option value="no reservados">No reservados</option>
            <option value="indistinto">Indistinto</option>
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
            value={mechanicSpecialty}
            onChange={(e) => setMechanicSpecialty(e.target.value) & {checkFiltersCompleted} } 
            
          >
            <option value="">Selecciona una opción</option>
            <option value="electromecanica">Electromecánica</option>
            <option value="frenos">Frenos</option>
            <option value="mecanica general">Mecánica general</option>
            <option value="suspension">Suspensión</option>
            <option value="transmision">Transmisión</option>
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
*/
import React, { useState } from "react";
import Navbar from "../components/NavBar";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { API_BASE_URL } from '../assets/config'; // Ajusta la ruta si es necesario
import "./Reports.css";

function Reports() {
  const [reportType, setReportType] = useState("");
  const [vehicleType, setVehicleType] = useState(""); 
  const [availability, setAvailability] = useState(""); 
  const [mechanicSpecialty, setMechanicSpecialty] = useState(""); 
  const [filtersCompleted, setFiltersCompleted] = useState(false);

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
    setFiltersCompleted(false);
  };

  const checkFiltersCompleted = () => {
    setFiltersCompleted(true);
  };

  // Función para generar el reporte PDF de gastos
  const generarReporteGastosPDF = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bills`);
      const bills = response.data;

      const doc = new jsPDF();
      doc.text("Reporte de Gastos", 14, 20);

      const columns = [
        { header: "ID", dataKey: "id" },
        { header: "Descripción", dataKey: "descripcion" },
        { header: "Monto", dataKey: "monto" },
        { header: "Estado", dataKey: "estado" },
        { header: "Fecha", dataKey: "fecha" },
      ];

      const rows = bills.map((bill) => ({
        descripcion: bill.descripcion,
        monto: bill.monto,
        estado: bill.estado,
        fecha: bill.fecha,
      }));

      doc.autoTable({
        columns: columns,
        body: rows,
        startY: 30,
      });

      doc.save("reporte_gastos.pdf");
    } catch (error) {
      console.error("Error al generar el reporte de gastos:", error);
    }
  };

  // Función para manejar la generación de reportes según el tipo seleccionado
  const handleGenerarReporte = () => {
    if (reportType === "gastos") {
      generarReporteGastosPDF();
    } else {
      alert("Generación de reportes para " + reportType + " aún no está implementada.");
    }
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

      {/* Filtros dinámicos según el tipo de reporte */}
      {reportType === "vehiculos" && (
        <div className="filter-fields">
          <label>Filtrar por tipo de vehículos:</label>
          <select
            id="vehiculoType"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
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
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          >
            <option value="">Selecciona una opción</option>
            <option value="reservados">Reservados</option>
            <option value="no reservados">No reservados</option>
            <option value="indistinto">Indistinto</option>
          </select>

          <label>Desde:</label>
          <input type="date" placeholder="Fecha desde" onChange={checkFiltersCompleted} />
          <label>Hasta:</label>
          <input type="date" placeholder="Fecha hasta" onChange={checkFiltersCompleted} />
        </div>
      )}

      {reportType === "gastos" && (
        <div className="filter-fields">
          <label>Filtrar por fecha:</label>
          <input type="date" placeholder="Fecha desde" onChange={checkFiltersCompleted} />
          <input type="date" placeholder="Fecha hasta" onChange={checkFiltersCompleted} />
        </div>
      )}

      {/* Botón para generar reporte PDF */}
      {filtersCompleted && (
        <div className="generate-report">
          <button onClick={handleGenerarReporte}>Generar Reporte PDF</button>
        </div>
      )}
    </div>
  );
}

export default Reports;
