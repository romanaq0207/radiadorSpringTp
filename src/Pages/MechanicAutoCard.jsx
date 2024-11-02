import React from "react";
import { useNavigate } from "react-router-dom";
import "./MechanicAutoCard.css";

const MechanicAutoCard = ({ auto }) => {
  const navigate = useNavigate();

  const handleAccidents = () => {
    navigate(`/autos-accidentes/${auto.id}`); 
  };

  const handleMaintenance = () => {
    navigate(`/autos/${auto.id}`); // Navega a la página de detalles del auto
  };

  return (
    <div className="auto-card">
      <h3>{auto.marca} {auto.modelo}</h3>
      <p><strong>Año:</strong> {auto.anio}</p>
      <p><strong>Kilometraje:</strong> {auto.kilometraje} km</p>
      <p><strong>Patente:</strong> {auto.nro_patente}</p>
      <button onClick={handleAccidents} className="details-button">Administrar accidentes</button>
      <button onClick={handleMaintenance} className="details-button">Agregar mantenimiento</button>
    </div>
  );
};

export default MechanicAutoCard;
