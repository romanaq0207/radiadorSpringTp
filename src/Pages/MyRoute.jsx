import React, { useState, useEffect } from "react";
import Navbar from "../components/NavBar";
import "./MyRoute.css";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { API_BASE_URL } from '../assets/config'; 

function MyRoute() {
  const [rutasAprobadas, setRutasAprobadas] = useState([]);
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/ver-rutas`)
      .then((response) => {
        const rutasAprobadas = response.data.filter(ruta => ruta.estado === 'aprobada');
        setRutasAprobadas(rutasAprobadas);
      })
      .catch((error) => console.error("Error al obtener rutas:", error));
  }, []);

  const handleRutaClick = (ruta) => {
    setRutaSeleccionada(ruta);
  };

  const completarRuta = (idRuta) => {
    axios.post(`${API_BASE_URL}/completar-ruta`, { id_ruta: idRuta })
      .then(() => {
        setRutasAprobadas(rutasAprobadas.filter(ruta => ruta.id_ruta !== idRuta));
        setRutaSeleccionada(null);
        alert("Ruta completada exitosamente");
      })
      .catch((error) => console.error("Error al completar ruta:", error));
  };

  return (
    <div>
      <Navbar />
      <div className="my-route-container">
        <div className="route-list">
          <h3>Rutas Aprobadas</h3>
          {rutasAprobadas.map((ruta) => (
            <div key={ruta.id_ruta} className="route-item" onClick={() => handleRutaClick(ruta)}>
              <p><strong>Fecha de Aprobación:</strong> {new Date(ruta.fecha_aprobacion).toLocaleString()}</p>
              <p><strong>Conductor:</strong> {ruta.conductor}</p>
            </div>
          ))}
        </div>
        <div className="map-section">
          {rutaSeleccionada ? (
            <div>
              <h3 className="route-details">Detalles de la Ruta</h3>
              <MapContainer center={[rutaSeleccionada.latitudA, rutaSeleccionada.longitudA]} zoom={13} style={{ height: "400px", width: "100%" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[rutaSeleccionada.latitudA, rutaSeleccionada.longitudA]}>
                  <Popup>Punto A</Popup>
                </Marker>
                <Marker position={[rutaSeleccionada.latitudB, rutaSeleccionada.longitudB]}>
                  <Popup>Punto B</Popup>
                </Marker>
                <Polyline positions={rutaSeleccionada.trazado} />
              </MapContainer>
              <button className="complete-button" onClick={() => completarRuta(rutaSeleccionada.id_ruta)}>
                Completar Ruta
              </button>
            </div>
          ) : (
            <p>Seleccione una ruta para ver los detalles</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyRoute;
