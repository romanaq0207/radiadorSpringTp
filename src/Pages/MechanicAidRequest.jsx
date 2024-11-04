import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MechanicAidRequest.css';
import { API_BASE_URL } from '../assets/config';

const MechanicAidRequest = () => {
  const [aidRequests, setAidRequests] = useState([]);
  const mapRefs = useRef({});

  const fetchAidRequests = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/solicitudes/pendientes`);
      const data = await response.json();
      setAidRequests(data);
    } catch (error) {
      console.error('Error al obtener solicitudes pendientes:', error);
    }
  };

  useEffect(() => {
    fetchAidRequests();
  }, []);

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
        setAidRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id_peticion === id ? { ...request, estado: 'aceptado' } : request
          )
        );

        Swal.fire('¡Aceptado!', 'La solicitud ha sido aceptada.', 'success');
      }
    });
  };

  return (
    <div className="mechanic-aid-request-container">
      <h1>Solicitudes de Ayuda</h1>
      <div className="aid-requests-list">
        {aidRequests.map((request) => (
          <div className="aid-request-card" key={request.id_peticion}>
            <div className="card-info">
              <h2>Conductor: {request.id_conductor}</h2>
              <p><strong>Patente:</strong> {request.patente_auto}</p>
              <p><strong>Fecha y hora de solicitud:</strong> {new Date(request.fecha_solicitud).toLocaleString()}</p>
              <p><strong>Descripción:</strong> {request.descripcion}</p>
            </div>
            {request.foto && (
              <div className="card-photo">
                <img src={`data:image/jpeg;base64,${request.foto}`} alt="Foto del problema" />
              </div>
            )}
            <div className="map-container">
              <div
                id={`map-${request.id_peticion}`}
                style={{ height: '200px', width: '100%' }}
                ref={(el) => {
                  if (el && !mapRefs.current[request.id_peticion]) {
                    // Crea el mapa solo si aún no existe para esta solicitud
                    mapRefs.current[request.id_peticion] = L.map(el).setView(
                      [request.latitud, request.longitud],
                      15
                    );
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                      attribution: '&copy; OpenStreetMap contributors'
                    }).addTo(mapRefs.current[request.id_peticion]);
                    L.marker([request.latitud, request.longitud]).addTo(mapRefs.current[request.id_peticion]);
                  }
                }}
              ></div>
            </div>
            <button
              className="accept-button"
              onClick={() => handleAcceptRequest(request.id_peticion)}
              disabled={request.estado === 'aceptado'}
            >
              {request.estado === 'aceptado' ? 'Aceptado' : 'Aceptar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MechanicAidRequest;
