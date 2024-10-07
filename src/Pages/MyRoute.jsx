import React, { useState, useEffect } from "react";
import ejemplo from "./Images/ejemplo-map.jpg";
import Navbar from "../components/NavBar";
import "./MyRoute.css";
// Importa los componentes de Leaflet
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Estilos de Leaflet
import L from "leaflet";
import axios from 'axios'; // Importa axios
import { API_BASE_URL } from '../assets/config'; 

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
  iconSize: [25, 41], // Tamaño del icono
  iconAnchor: [12, 41], // Punto de anclaje del icono
  popupAnchor: [1, -34], // Anclaje del popup
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png", // Sombra del icono
});

function MyRoute() {
  const [ubicacion, setUbicacion] = useState({ lat: null, lon: null });
  const [error, setError] = useState(null);
  const [id_conductor, setIdConductor] = useState(1); // Suponiendo que tienes un id_conductor
  const [ultimaUbicacion, setUltimaUbicacion] = useState(null); // Para almacenar la última ubicación enviada

  useEffect(() => {
    let intervalo;

    // Verificar si el navegador soporta la geolocalización
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLat = position.coords.latitude;
          const newLon = position.coords.longitude;

          // Actualizar la ubicación cada vez que cambia
          setUbicacion({
            lat: newLat,
            lon: newLon,
          });

          // Actualizar la última ubicación sin enviar datos todavía
          setUltimaUbicacion({
            lat: newLat,
            lon: newLon,
            fecha_hora: new Date().toISOString().slice(0, 19).replace('T', ' ')
          });
        },
        (error) => {
          console.error("Error obteniendo la ubicación:", error);
          setError("No se pudo obtener la ubicación.");
        }
      );

      // Configurar un intervalo para enviar la ubicación cada 10 segundos
      intervalo = setInterval(async () => {
        if (ultimaUbicacion) {
          console.log("Enviando datos:", {
            id_conductor,
            fecha_hora: ultimaUbicacion.fecha_hora,
            latitud: ultimaUbicacion.lat,
            longitud: ultimaUbicacion.lon
          });

          try {
            await axios.post(`${API_BASE_URL}/ubicacion-conductor`, {
              id_conductor,
              fecha_hora: ultimaUbicacion.fecha_hora,
              latitud: ultimaUbicacion.lat,
              longitud: ultimaUbicacion.lon
            });
          } catch (error) {
            console.error("Error al enviar la ubicación:", error);
            setError("Error al enviar la ubicación.");
          }
        }
      }, 10000); // 10000 ms = 10 segundos

      // Limpiar el rastreo y el intervalo cuando el componente se desmonte
      return () => {
        navigator.geolocation.clearWatch(watchId);
        clearInterval(intervalo);
      };
    } else {
      setError("La geolocalización no es soportada por este navegador.");
    }
  }, [id_conductor, ultimaUbicacion]);

  return (
    <div>
      <Navbar />
      <div className="map-container">
        <h2>Mi Ubicación en Tiempo Real</h2>
        {error ? (
          <p>{error}</p>
        ) : ubicacion.lat && ubicacion.lon ? (
          <div>
            <p>Latitud: {ubicacion.lat}</p>
            <p>Longitud: {ubicacion.lon}</p>
            <MapContainer
              center={[ubicacion.lat, ubicacion.lon]}
              zoom={13}
              style={{ height: "600px", width: "80vw" }}
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[ubicacion.lat, ubicacion.lon]} icon={markerIcon}>
                <Popup>
                  Estás aquí: <br />
                  Latitud: {ubicacion.lat}, Longitud: {ubicacion.lon} {}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        ) : (
          <p>Cargando ubicación...</p>
        )}
      </div>
    </div>
  );
}

export default MyRoute;
