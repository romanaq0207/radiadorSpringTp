import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import "./RoutesCard.css";

const RutesCard = ({ ruta }) => {
  const navigate = useNavigate();

  const handleVerify = () => {
    navigate(`/rutas/${ruta.id}`); // Navega a la página de detalles del auto
  };

  return (
    <div className="routes-card">
      <h3>
        <strong>Desde, </strong>
        {ruta.desde}
      </h3>
      <h3>
        <strong>Hasta, </strong>
        {ruta.hasta}
      </h3>
      <p>
        <strong>Fecha:</strong> {ruta.fecha}
      </p>
      <p>
        <strong>Estado:</strong> {ruta.estado}
      </p>
      <p>
        <strong>Número de ruta:</strong> {ruta.id}
      </p>
      <button onClick={handleVerify} className="details-button">
      <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
    </div>
  );
};

export default RutesCard;
