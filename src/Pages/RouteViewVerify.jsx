import React, { useState, useEffect } from "react";
import "./RouteViewVerify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark} from '@fortawesome/free-solid-svg-icons';
import Navbar from "../components/NavBar";
import { API_BASE_URL } from "../assets/config";

function RuteViewVerify() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [routeDetail, setRouteDetail] = useState([]);

  useEffect(() => {
    fetch("/src/data/rutas.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.find((item) => item.id === parseInt(id));
        setRouteDetail(filteredData);
      })
      .catch((error) => console.error("Error al leer el JSON:", error));
  }, [id]);

  const handleMarkAsAccepted = () => {
    setRouteDetail((prevState) => ({
      ...prevState,
      estado: "Aprobado",
    }));
  };

  const handleMarkAsRejected = () => {
    setRouteDetail((prevState) => ({
      ...prevState,
      estado: "Rechazado",
    }));
  };

  const handleReturnRoutes = () => {
    navigate("/verificar-rutas");
  };

  return (
    <div id="route-detail-container">
      <Navbar />

      <div id="map-container">
        <img src={routeDetail["rutaDada"]} alt="Mapa de ruta" />
      </div>
      <div id="detalles-container">
        <h2>Desde: {routeDetail.desde}</h2>
        <h2>Hasta: {routeDetail.hasta}</h2>
        <h2>Estado Actual: {routeDetail.estado}</h2>
        <button
          className="button-estado"
          disabled={
            routeDetail.estado === "Rechazado" ||
            routeDetail.estado === "Aprobado"
          }
          onClick={handleMarkAsAccepted}
        >
          <FontAwesomeIcon icon={faCheck} />
        </button>
        <button
          className="button-estado"
          disabled={
            routeDetail.estado === "Rechazado" ||
            routeDetail.estado === "Aprobado"
          }
          onClick={handleMarkAsRejected}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <h4 onClick={handleReturnRoutes} id="volver-rutas">
          Volver
        </h4>
      </div>
    </div>
  );
}

export default RuteViewVerify;
