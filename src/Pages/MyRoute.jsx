import React, { useState, useEffect } from "react";
import Navbar from "../components/NavBar";
import "./MyRoute.css";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { API_BASE_URL } from '../assets/config';

function MyRoute() {
  const [rutasPendientes, setRutasPendientes] = useState([]);
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  const [dniConductor, setDniConductor] = useState(null);

  useEffect(() => {
    // Aquí asumimos que el DNI del conductor está en el localStorage o contexto
    const storedDni = localStorage.getItem('dniConductor');  // O donde sea que guardes el DNI del conductor logueado

    if (storedDni) {
      setDniConductor(storedDni);
    } else {
      console.error("DNI del conductor no encontrado");
    }
  }, []);

  useEffect(() => {
    if (dniConductor) {
      // Hacemos la solicitud al nuevo endpoint con el DNI del conductor logueado
      axios.get(`${API_BASE_URL}/rutas-pendientes/${dniConductor}`)
        .then((response) => {
          setRutasPendientes(response.data);
        })
        .catch((error) => console.error("Error al obtener rutas:", error));
    }
  }, [dniConductor]);

  const handleRutaClick = (ruta) => {
    setRutaSeleccionada(ruta);
  };

  const completarRuta = (idRuta) => {
    axios.post(`${API_BASE_URL}/completar-ruta`, { id_ruta: idRuta })
      .then(() => {
        setRutasPendientes(prevRutas => prevRutas.filter(ruta => ruta.id_ruta !== idRuta));
        setRutaSeleccionada(null);
        alert("Ruta completada exitosamente");
      })
      .catch((error) => {
        console.error("Error al completar ruta:", error);
        alert("Hubo un error al completar la ruta.");
      });
  };

  const calcularTiempoEstimado = (distancia) => {
    const velocidadPromedio = 60; // km/h
    const tiempoHoras = distancia / velocidadPromedio;
    const horas = Math.floor(tiempoHoras);
    const minutos = Math.round((tiempoHoras - horas) * 60);
    return `${horas}h ${minutos}min`;
  };

  return (
    <div className="my-route-container">
      <Navbar />
      <div className="route-content">
        <div className="map-section">
          {rutaSeleccionada ? (
            <div className="route-details-container">
              <MapContainer center={[rutaSeleccionada.trazado[0].lat, rutaSeleccionada.trazado[0].lng]} zoom={13} style={{ height: "400px", width: "100%" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <Polyline positions={rutaSeleccionada.trazado.map(coord => [coord.lat, coord.lng])} color="blue" />
                <Marker position={[rutaSeleccionada.trazado[0].lat, rutaSeleccionada.trazado[0].lng]}>
                  <Popup>Punto de inicio</Popup>
                </Marker>
                <Marker position={[rutaSeleccionada.trazado[rutaSeleccionada.trazado.length - 1].lat, rutaSeleccionada.trazado[rutaSeleccionada.trazado.length - 1].lng]}>
                  <Popup>Punto final</Popup>
                </Marker>
              </MapContainer>
              <div className="route-details">
                <h3>Detalles de la Ruta</h3>
                <p><strong>Conductor:</strong> {rutaSeleccionada.conductor}</p>
                <p><strong>DNI del Conductor:</strong> {rutaSeleccionada.dni_conductor}</p>
                <p><strong>Fecha de Aprobación:</strong> {new Date(rutaSeleccionada.fecha_aprobacion).toLocaleString()}</p>
                <p><strong>Distancia Total:</strong> {rutaSeleccionada.distancia_total_km} km</p>
                <p><strong>Tiempo Estimado:</strong> {calcularTiempoEstimado(rutaSeleccionada.distancia_total_km)}</p>
                <button onClick={() => completarRuta(rutaSeleccionada.id_ruta)}>Completar Ruta</button>
              </div>
            </div>
          ) : (
            <p>Selecciona una ruta para ver los detalles.</p>
          )}
        </div>
        <div className="route-list">
          <h3>Rutas Pendientes</h3>
          <ul>
            {rutasPendientes.map((ruta) => (
              <li key={ruta.id_ruta} onClick={() => handleRutaClick(ruta)} className="route-item">
                {new Date(ruta.fecha_aprobacion).toLocaleDateString()} - {ruta.conductor}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MyRoute;
