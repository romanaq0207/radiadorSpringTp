import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircleInfo,faPenToSquare,faTrash} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import "./AutoCard.css";

const AutoCard = ({ auto }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/autos/${auto.id}`); // Navega a la página de detalles del auto
  };

  const handleEditCar = () => {
    navigate(`/edit-car/${auto.id}`); // Navega a la página de edición del auto
  };

  return (
    <div className="auto-card">
      <h3>{auto.marca} {auto.modelo}</h3>
      <p><strong>Año:</strong> {auto.anio}</p>
      <p><strong>Kilometraje:</strong> {auto.kilometraje} km</p>
      <p><strong>Patente:</strong> {auto.nro_patente}</p>
      <div className="auto-card__buttons">
        <button onClick={handleViewDetails} className="details-button"><FontAwesomeIcon icon={faCircleInfo} style={{color: "#ffffff",}} /></button>
        <button onClick={handleEditCar} className="edit-button"><FontAwesomeIcon icon={faPenToSquare} /></button>
        <button className="delete-button"><FontAwesomeIcon icon={faTrash} /></button>
      </div>
    </div>
  );
};

export default AutoCard;
