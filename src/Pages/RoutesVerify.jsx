// RutesVerify.js
import React, { useState, useEffect } from "react";
import RutesCard from "./RoutesCard";
import "./RoutesVerify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import { API_BASE_URL } from "../assets/config";

function RutesVerify() {
  const [allRutas, setAllRutas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/ver-rutas`)
      .then((response) => setAllRutas(response.data))
      .catch((error) => console.error("Error al obtener rutas:", error));
  }, []);

  const handleApprove = (idRuta) => {
    axios
      .post(`${API_BASE_URL}/aprobar-ruta`, { id_ruta: idRuta })
      .then(() => {
        // Actualiza el estado local para reflejar el cambio
        setAllRutas((prevRutas) =>
          prevRutas.map((ruta) =>
            ruta.id_ruta === idRuta ? { ...ruta, estado: "aprobada" } : ruta
          )
        );
      })
      .catch((error) => console.error("Error al aprobar ruta:", error));
  };

  const handleReject = (idRuta) => {
    axios
      .post(`${API_BASE_URL}/rechazar-ruta`, { id_ruta: idRuta })
      .then(() => {
        // Actualiza el estado local para reflejar el cambio
        setAllRutas((prevRutas) =>
          prevRutas.map((ruta) =>
            ruta.id_ruta === idRuta ? { ...ruta, estado: "rechazada" } : ruta
          )
        );
      })
      .catch((error) => console.error("Error al rechazar ruta:", error));
  };

  return (
    <div className="routes-verify-container">
      <Navbar />
      <h2>RUTAS</h2>

      <div className="routes-card-list">
        {allRutas.length > 0 ? (
          allRutas.map((ruta) => (
            <RutesCard
              key={ruta.id_ruta}
              ruta={ruta}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))
        ) : (
          <p>No se encontraron rutas.</p>
        )}
      </div>
    </div>
  );
}

export default RutesVerify;
