import React, { useState, useEffect } from "react";
import MechanicAutoCard from "./MechanicAutoCard"; // Componente correcto
import "./MechanicAutoSearch.css"; // Asegúrate de tener el archivo CSS
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import { API_BASE_URL } from "../assets/config";

function AutoSearch() { // Nombre del componente corregido
  const [searchTerm, setSearchTerm] = useState("");
  const [allAutos, setAllAutos] = useState([]); // Estado para todos los autos
  const [filteredAutos, setFilteredAutos] = useState([]);
  const [error, setError] = useState(null); // Estado para manejar errores
  const navigate = useNavigate();

  useEffect(() => {
    // Llamada a la API para obtener los autos
    axios
      .get(`${API_BASE_URL}/autos`)
      .then((response) => {
        setAllAutos(response.data);
        setFilteredAutos(response.data); // Inicialmente, todos los autos están en la lista filtrada
      })
      .catch((error) => {
        console.error("Error al obtener los autos:", error);
        setError("No se pudo obtener la información de los autos."); // Manejo de errores
      });
  }, []);

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    filterAutos(term);
  };

  const filterAutos = (term) => {
    if (term === "") {
      setFilteredAutos(allAutos);
    } else {
      const filtered = allAutos.filter((auto) =>
        auto.nro_patente.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredAutos(filtered);
    }
  };

  const handleAddAuto = () => {
    navigate("/agregar-auto");
  };

  const handleScanQR = () => {
    navigate("/escanear-qr");
  };

  return (
    <div className="auto-search-container">
      <Navbar />
      <h2>Búsqueda de Autos</h2>
      <div className="search-add-container">
        <input
          type="text"
          placeholder="Buscar por patente..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="auto-search-input"
        />
        {/* Botones debajo de la barra de búsqueda */}
        <div className="buttons-search-add-container">
          <button onClick={handleAddAuto} className="add-auto-button">
            Agregar Auto
          </button>
          <button onClick={handleScanQR} className="scan-qr-button">
            Escanear QR
          </button>
        </div>
      </div>

      {/* Mostrar mensaje de error si hay problemas al obtener los autos */}
      {error ? <p>{error}</p> : null}

      {/* Mostrar autos filtrados */}
      <div className="auto-card-list">
        {filteredAutos.length > 0 ? (
          filteredAutos.map((auto) => (
            <MechanicAutoCard key={auto.id} auto={auto} />
          ))
        ) : (
          <p>No se encontraron autos.</p>
        )}
      </div>
    </div>
  );
}

export default AutoSearch; // Exportación corregida
