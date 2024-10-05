import React, { useState, useEffect } from "react";
import ejemplo from "./Images/ejemplo-map.jpg";
import Navbar from "../components/NavBar";
import "./MyRoute.css";

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
            {/* Aquí podrías integrar un mapa real en lugar de una imagen de ejemplo */}
            
          </div>
        ) : (
          <p>Cargando ubicación...</p>
        )}
      </div>
    </div>
  );
}

export default MyRoute;
