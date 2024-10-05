import React, { useState, useEffect } from "react";
import ejemplo from "./Images/ejemplo-map.jpg";
import Navbar from "../components/NavBar";
import "./MyRoute.css";
// Importa los componentes de Leaflet
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Estilos de Leaflet
import L from "leaflet";

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

  // Función para manejar la ubicación en tiempo real
  useEffect(() => {
    // Verificar si el navegador soporta la geolocalización
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          // Actualizar la ubicación cada vez que cambia
          setUbicacion({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error obteniendo la ubicación:", error);
          setError("No se pudo obtener la ubicación.");
        }
      );

      // Limpiar el rastreo cuando el componente se desmonte
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setError("La geolocalización no es soportada por este navegador.");
    }
  }, []);

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
            {/* Mapa de OpenStreetMap */}
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
                  Latitud: {ubicacion.lat}, Longitud: {ubicacion.lon}
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
