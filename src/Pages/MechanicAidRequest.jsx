import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './MechanicAidRequest.css';

const MechanicAidRequest = () => {
  // Ejemplo de solicitudes de ayuda con estado inicial
  const [aidRequests, setAidRequests] = useState([
    {
      id: 1,
      mechanic: 'Juan Pérez',
      date: '2024-11-01',
      time: '14:30',
      location: 'Av. Siempre Viva 742',
      description: 'Problema en el sistema de frenos.',
      photo: '',
      status: 'pendiente',
    },
    {
      id: 2,
      mechanic: 'Ana García',
      date: '2024-11-01',
      time: '10:00',
      location: 'Calle Falsa 123',
      description: 'Fallo en el motor.',
      photo: 'https://picsum.photos/200/300',
      status: 'pendiente',
    },
    {
        id: 3,
        mechanic: 'Juan Pérez',
        date: '2024-11-01',
        time: '14:30',
        location: 'Av. Siempre Viva 742',
        description: 'Problema en el sistema de frenos.',
        photo: '',
        status: 'aceptado',
      },
      {
        id: 4,
        mechanic: 'Juan Pérez',
        date: '2024-11-01',
        time: '14:30',
        location: 'Av. Siempre Viva 742',
        description: 'Problema en el sistema de frenos.',
        photo: '',
        status: 'pendiente',
      },
  ]);

  // Función para manejar la aceptación de la solicitud
  const handleAcceptRequest = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas aceptar esta solicitud de ayuda?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Actualiza el estado de la solicitud a "aceptado"
        setAidRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id === id ? { ...request, status: 'aceptado' } : request
          )
        );

        Swal.fire('¡Aceptado!', 'La solicitud ha sido aceptada.', 'success');
      }
    });
  };

  return (
    <div className="mechanic-aid-request-container">
      <h1>Solicitudes de ayuda</h1>
      <div className="aid-requests-list">
        {aidRequests.map((request) => (
          <div className="aid-request-card" key={request.id}>
            <div className="card-info">
              <h2>Mecánico: {request.mechanic}</h2>
              <p><strong>Fecha y hora:</strong> {request.date} - {request.time}</p>
              <p><strong>Ubicación:</strong> {request.location}</p>
              <p><strong>Descripción:</strong> {request.description}</p>
            </div>
            {request.photo && (
              <div className="card-photo">
                <img src={request.photo} alt="Foto del problema" />
              </div>
            )}
            <button
              className="accept-button"
              onClick={() => handleAcceptRequest(request.id)}
              disabled={request.status === 'aceptado'}
            >
              {request.status === 'aceptado' ? 'Aceptado' : 'Aceptar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MechanicAidRequest;
