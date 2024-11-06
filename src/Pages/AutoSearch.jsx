import React, { useState, useEffect } from "react";
import AutoCard from "./AutoCard";
import "./AutoSearch.css";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCirclePlus,faQrcode} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import { API_BASE_URL } from "../assets/config";

function AutoSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allAutos, setAllAutos] = useState([]);
  const [filteredAutos, setFilteredAutos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/obtener_autos`)
      .then((response) => {
        setAllAutos(response.data);
        setFilteredAutos(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los autos:", error);
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
    <div className="auto-search">
      <Navbar />
      <h2 className="auto-search__title">Búsqueda de Autos</h2>
      <div className="auto-search__search-add">
        <input
          type="text"
          placeholder="Buscar por patente..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="auto-search__input"
        />
        <div className="auto-search__buttons">
          <button onClick={handleAddAuto} className="auto-search__add-auto">
          <FontAwesomeIcon icon={faCirclePlus} style={{color: "#ffffff",}} />
          </button>
          <button onClick={handleScanQR} className="auto-search__scan-qr">
          <FontAwesomeIcon icon={faQrcode} style={{color: "#ffffff",}} />
          </button>
        </div>
      </div>
      <div className="auto-search__list">
        {filteredAutos.length > 0 ? (
          filteredAutos.map((auto) => <AutoCard key={auto.id} auto={auto} />)
        ) : (
          <p>No se encontraron autos.</p>
        )}
      </div>
    </div>
  );
}

export default AutoSearch;
