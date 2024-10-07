import React, { useState, useEffect } from "react";
import ejemplo from "./Images/ejemplo-map.jpg";
import Navbar from "../components/NavBar";
import "./MyRoute.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from 'axios';
import { API_BASE_URL } from '../assets/config';

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
});

function MyRoute() {
  const [ubicacion, setUbicacion] = useState({ lat: null, lon: null });
  const [error, setError] = useState(null);
  const [id_conductor, setIdConductor] = useState(1);

  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLat = position.coords.latitude;
          const newLon = position.coords.longitude;

          setUbicacion({
            lat: newLat,
            lon: newLon,
          });

          // Agregar un delay de 10 segundos antes de enviar la ubicación
          setTimeout(async () => {
            try {
              await axios.post(`${API_BASE_URL}/ubicacion-conductor`, {
                id_conductor,
                fecha_hora: new Date().toISOString().slice(0, 19).replace('T', ' '),
                latitud: newLat,
                longitud: newLon
              });
            } catch (error) {
              console.error("Error al enviar la ubicación:", error);
              setError("Error al enviar la ubicación.");
            }
          }, 10000); // 10 segundos de delay
        },
        (error) => {
          console.error("Error obteniendo la ubicación:", error);
          setError("No se pudo obtener la ubicación.");
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setError("La geolocalización no es soportada por este navegador.");
    }
  }, [id_conductor]);

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
