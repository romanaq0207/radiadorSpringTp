import React, { useState, useEffect } from "react";
import MechanicAutoCard from "./MechanicAutoCard"; // Componente correcto
import styles from "./MechanicAutoSearch.module.css"; // Cambia a .module.css
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/NavBar";
import { API_BASE_URL } from "../assets/config";

function AutoSearch() {
  // Nombre del componente corregido
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMarcaTerm, setSearchMarcaTerm] = useState("");
  const [searchModeloTerm, setSearchModeloTerm] = useState("");
  const [error, setError] = useState("");
  const [allAutos, setAllAutos] = useState([]);
  const [filteredAutos, setFilteredAutos] = useState([]);
  const navigate = useNavigate();
  const marcas = ["Mercedez Benz", "Volkswagen", "Renault", "Iveco"];
  const modelos = {
    "Mercedez Benz": ["Actros", "Arocs", "Atego", "Econic"],
    Volkswagen: ["Delivery", "Constellation", "Meteor"],
    Renault: ["Master", "Trafic", "D-Truck", "Midlum"],
    Iveco: ["Stralis", "Trakker", "Eurocargo"],
  };
  const [selectedMarca, setSelectedMarca] = useState("");
  const [selectedModelo, setSelectedModelo] = useState("");
  const maxKilometraje = 1000000;
  const [selectedKilometraje, setSelectedKilometraje] =
    useState(maxKilometraje);
  const currentYear = new Date().getFullYear();
  const [selectedAnio, setSelectedAnio] = useState(currentYear);

  useEffect(() => {
    // Llamada a la API para obtener los autos
    axios
      .get(`${API_BASE_URL}/obtener_autos`)
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
  const handleMarcaChange = (e) => {
    const marca = e.target.value === "" ? "Todas" : e.target.value;
    setSelectedMarca(marca);
    setSelectedModelo("");
    setSearchMarcaTerm(marca);
    filterAutosMarca(marca);
    applyAllFilters();
  };
  const handleModeloChange = (e) => {
    const modelo = e.target.value === "" ? "Todos" : e.target.value;
    setSelectedModelo(modelo);
    setSearchModeloTerm(modelo);
    filterAutosModelo(modelo);
    applyAllFilters();
  };
  const handleKilometrajeChange = (e) => {
    const kilometraje = e.target.value;
    setSelectedKilometraje(kilometraje);
    filterAutosKilometraje(kilometraje);
    applyAllFilters();
  };
  const handleResetRange = () => {
    // setSelectedKilometraje(10000);
    // setSelectedAnio(currentYear);
    applyAllFilters();
  };
  const handleAnioChange = (e) => {
    const anio = e.target.value;
    setSelectedAnio(anio);
    filterAutosAnio(anio);
    applyAllFilters();
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
  const filterAutosMarca = (term) => {
    if (term === "Todas" || term === "") {
      setFilteredAutos(allAutos);
    } else {
      const filtered = allAutos.filter((auto) => auto.marca.includes(term));
      setFilteredAutos(filtered);
    }
    applyAllFilters();
  };
  const filterAutosModelo = (term) => {
    if (term === "Todos" || term === "") {
      if (selectedMarca === "Todas") {
        setFilteredAutos(allAutos);
      } else {
        const filtered = allAutos.filter(
          (auto) => auto.marca === selectedMarca
        );
        setFilteredAutos(filtered);
      }
    } else {
      const filtered = allAutos.filter((auto) => auto.modelo.includes(term));
      setFilteredAutos(filtered);
    }
    applyAllFilters();
  };
  const filterAutosKilometraje = (kilometraje) => {
    if (kilometraje === 0) {
      setFilteredAutos(allAutos);
    }
    const filtered = allAutos.filter((auto) => auto.kilometraje <= kilometraje);
    setFilteredAutos(filtered);
    applyAllFilters();
  };
  const filterAutosAnio = (anio) => {
    if (anio === currentYear) {
      setFilteredAutos(allAutos);
    }
    const filtered = allAutos.filter((auto) => auto.anio <= anio);
    setFilteredAutos(filtered);
    applyAllFilters();
  };

  const applyAllFilters = () => {
    let filtered = allAutos;
    if (selectedMarca && selectedMarca !== "Todas") {
      filtered = filtered.filter((auto) => auto.marca.includes(selectedMarca));
    }
    if (selectedModelo && selectedModelo !== "Todos") {
      filtered = filtered.filter((auto) =>
        auto.modelo.includes(selectedModelo)
      );
    }
    if (selectedKilometraje) {
      filtered = filtered.filter(
        (auto) => auto.kilometraje <= selectedKilometraje
      );
    }
    if (selectedAnio) {
      filtered = filtered.filter((auto) => auto.anio <= selectedAnio);
    }
    setFilteredAutos(filtered);
  };

  const handleScanQR = () => {
    navigate("/escanear-qr");
  };

  return (
    <div className={styles["auto-search-container"]}>
      <Navbar />
      <h2 className={styles["title"]}>Búsqueda de Autos</h2>
      <div className={styles["search-add-container"]}>
        <input
          type="text"
          placeholder="Buscar por patente..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles["auto-search-input"]}
        />
        <select
          name="marca"
          value={selectedMarca}
          onChange={handleMarcaChange}
          className="auto-search__input"
        >
          {" "}
          <option value="" disabled>
            {" "}
            Buscar por marca del vehículo{" "}
          </option>{" "}
          <option value="">Todas</option>
          {marcas.map((marca) => (
            <option key={marca} value={marca}>
              {" "}
              {marca}{" "}
            </option>
          ))}{" "}
        </select>

        <select
          name="modelo"
          value={selectedModelo}
          onChange={handleModeloChange}
          className="auto-search__input"
          required
        >
          <option value="" disabled>
            Buscar por modelo
          </option>{" "}
          <option value="">Todos</option>
          {selectedMarca &&
            (selectedMarca === "Todas"
              ? Object.keys(modelos).flatMap((marca) =>
                  modelos[marca].map((modelo) => (
                    <option key={modelo} value={modelo}>
                      {" "}
                      {modelo}{" "}
                    </option>
                  ))
                )
              : modelos[selectedMarca].map((modelo) => (
                  <option key={modelo} value={modelo}>
                    {" "}
                    {modelo}{" "}
                  </option>
                )))}
        </select>
        <button onClick={handleResetRange}>Aplicar</button>
        <span>{selectedKilometraje} km</span>
        <input
          type="range"
          min="0"
          max={maxKilometraje}
          value={selectedKilometraje}
          onChange={handleKilometrajeChange}
          className="auto-search__input_range"
        />

        <span>Año {selectedAnio}</span>
        <input
          type="range"
          min={currentYear - 30}
          max={currentYear}
          value={selectedAnio}
          onChange={handleAnioChange}
          className="auto-search__input_range"
        />
        <div className={styles["buttons-search-add-container"]}>
          <button onClick={handleScanQR} className={styles["scan-qr-button"]}>
            <FontAwesomeIcon icon={faQrcode} style={{ color: "#e0e0e0" }} />
          </button>
        </div>
      </div>

      {error ? <p>{error}</p> : null}

      <div className={styles["auto-card-list"]}>
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
