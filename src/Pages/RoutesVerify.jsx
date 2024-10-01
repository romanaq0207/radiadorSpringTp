import React, { useState, useEffect } from "react";
import RutesCard from "./RoutesCard";
import "./RoutesVerify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import { API_BASE_URL } from "../assets/config";

function RutesVerify() {
  const [allRutas, setAllrutas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("src/data/rutas.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setAllrutas(data))
      .catch((error) => console.error("Error al leer el JSON:", error));
  }, []);

  return (
    <div className="routes-verify-container" id="routes-verify-container">
      <Navbar />
      <h2>RUTAS</h2>

      <div className="routes-card-list" id="routes-card-list">
        {allRutas.length > 0 ? (
          allRutas.map((ruta) => <RutesCard key={ruta.id} ruta={ruta} />)
        ) : (
          <p>No se encontraron rutas.</p>
        )}
        {/* <ul className="lista" id="lista">
          {rutas.map((ruta, index) => (
            <div key={index} className="gasto-item">
              <strong>Descripción:</strong> {ruta.desde} <br />
              <strong>Monto:</strong> ${ruta.hasta} <br />
              <strong>Fecha:</strong> {ruta.fecha}
              <br />
            </div>
          ))}
        </ul> */}
      </div>
    </div>
  );
}

export default RutesVerify;
