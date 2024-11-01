import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircleInfo,faPenToSquare,faTrash} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import "./AutoCard.css";
import Swal from 'sweetalert2'; // Importa SweetAlert2

const AutoCard = ({ auto }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/autos/${auto.id}`); // Navega a la página de detalles del auto
  };

  const handleEditCar = () => {
    navigate(`/edit-car/${auto.id}`); // Navega a la página de edición del auto
  };

  const handleDeleteCar = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Lógica para eliminar el auto, como hacer una petición a la API
        // axios.delete(`URL_API/${auto.id}`)
        //   .then(() => console.log('Auto eliminado'))
        //   .catch(error => console.error('Error al eliminar el auto:', error));

        Swal.fire(
          '¡Eliminado!',
          'El auto ha sido eliminado.',
          'success'
        );
      }
    });
  };

  return (
    <div className="auto-card">
      <h3>{auto.marca} {auto.modelo}</h3>
      <p><strong>Año:</strong> {auto.anio}</p>
      <p><strong>Kilometraje:</strong> {auto.kilometraje} km</p>
      <p><strong>Patente:</strong> {auto.nro_patente}</p>
      <div className="auto-card__buttons">
        <button onClick={handleEditCar} className="edit-button"><FontAwesomeIcon icon={faPenToSquare} /></button>
        <button onClick={handleDeleteCar} className="delete-button"><FontAwesomeIcon icon={faTrash} /></button>
      </div>
    </div>
  );
};

export default AutoCard;
