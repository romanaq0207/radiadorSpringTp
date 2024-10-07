import React from "react";
import { useNavigate } from "react-router-dom";
import "./MechanicAutoCard.css";

const MechanicAutoCard = ({ auto }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/autos-accidentes/${auto.id}`); // Navega a la página de detalles del auto
  };

  return (
    <div className="auto-card">
      <h3>{auto.marca} {auto.modelo}</h3>
      <p><strong>Año:</strong> {auto.anio}</p>
      <p><strong>Kilometraje:</strong> {auto.kilometraje} km</p>
      <p><strong>Patente:</strong> {auto.nro_patente}</p>
      <button onClick={handleViewDetails} className="details-button">Administrar accidentes</button>
    </div>
  );
};

export default MechanicAutoCard;
