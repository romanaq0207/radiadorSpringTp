import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import "./RouteCreate.css";

function RouteCreate() {
  const navigate = useNavigate();

  const mapRef = useRef(null); // Referencia para el mapa
  const [rutaData, setRutaData] = useState({
    desde: "",
    hasta: "",
    conductor: "",
    conductorDni: "",
  });

  const [suggestionsDesde, setSuggestionsDesde] = useState([]);
  const [suggestionsHasta, setSuggestionsHasta] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRutaData({ ...rutaData, [name]: value });

    // Llamar a autocompletar si se está escribiendo en los campos de "desde" o "hasta"
    if (name === "desde") {
      handleAutocomplete(value, setSuggestionsDesde);
    } else if (name === "hasta") {
      handleAutocomplete(value, setSuggestionsHasta);
    }
  };

  const handleAddRoute = async (e) => {
    e.preventDefault();
    const { desde, hasta } = rutaData;

    // Valida que ambas direcciones sean correctas
    const desdeCoords = await geocodeAddress(desde);
    const hastaCoords = await geocodeAddress(hasta);

    if (!desdeCoords || !hastaCoords) {
      alert("Una o ambas direcciones no son válidas.");
      return;  // Detiene el proceso si no son válidas
    }

    // Si las direcciones son válidas, continúa con la creación de la ruta
    geocodeAndCreateRoute(desdeCoords, hastaCoords);
  };

  useEffect(() => {
    // Solo inicializar el mapa si aún no existe
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([51.505, -0.09], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }
  }, []); // Este effect solo se ejecutará una vez cuando el componente se monte

  // Geocodificar direcciones y crear la ruta
  const geocodeAndCreateRoute = async (desdeCoords, hastaCoords) => {
    if (mapRef.current) {
      // Crear la ruta usando Leaflet Routing Machine
      L.Routing.control({
        waypoints: [
          L.latLng(desdeCoords.lat, desdeCoords.lon),
          L.latLng(hastaCoords.lat, hastaCoords.lon),
        ],
        routeWhileDragging: true,
      }).addTo(mapRef.current);

      // Añadir marcadores para las ubicaciones
      L.marker([desdeCoords.lat, desdeCoords.lon]).addTo(mapRef.current);
      L.marker([hastaCoords.lat, hastaCoords.lon]).addTo(mapRef.current);

      alert("Ruta creada con éxito");
    } else {
      alert("Hubo un problema al generar el mapa.");
    }
  };

  // Función para geocodificar direcciones utilizando Nominatim
  const geocodeAddress = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(address)}&countrycodes=AR&limit=1`;

    const response = await fetch(url);
    const data = await response.json();

    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      return { lat, lon };
    } else {
      return null;
    }
  };

  // Función para autocompletar direcciones
  const handleAutocomplete = async (query, setSuggestions) => {
    if (query.length > 3) { // Empieza a buscar después de 3 caracteres
      const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(query)}&countrycodes=AR&limit=5`;

      const response = await fetch(url);
      const data = await response.json();

      if (data && data.length > 0) {
        const suggestions = data.map(item => item.display_name);
        setSuggestions(suggestions);  // Actualiza las sugerencias
      }
    }
  };

  return (
    <div className="add-route">
      <h2>Crear Nueva Ruta</h2>
      <form onSubmit={handleAddRoute}>
        <input
          type="text"
          name="desde"
          placeholder="Punto de partida"
          value={rutaData.desde}
          onChange={handleInputChange}
          required
        />
        {/* Muestra las sugerencias de autocompletado */}
        {suggestionsDesde.length > 0 && (
          <ul className="suggestions">
            {suggestionsDesde.map((suggestion, index) => (
              <li key={index} onClick={() => setRutaData({ ...rutaData, desde: suggestion })}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}

        <input
          type="text"
          name="hasta"
          placeholder="Destino"
          value={rutaData.hasta}
          onChange={handleInputChange}
          required
        />
        {/* Muestra las sugerencias de autocompletado */}
        {suggestionsHasta.length > 0 && (
          <ul className="suggestions">
            {suggestionsHasta.map((suggestion, index) => (
              <li key={index} onClick={() => setRutaData({ ...rutaData, hasta: suggestion })}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}

        <input
          type="text"
          name="conductor"
          placeholder="Conductor Asignado"
          value={rutaData.conductor}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          maxLength="10"
          pattern="\d+"
          title="Solo se permiten números."
          name="conductorDni"
          placeholder="DNI de Conductor Asignado"
          value={rutaData.conductorDni}
          onChange={handleInputChange}
          required
        />
        
        <input id="submit-ruta" type="submit" value="Cargar Ruta" />
      </form>
      
      <div id="map" style={{ height: "400px", width: "100%", marginTop: "20px" }}></div>
    </div>
  );
}

export default RouteCreate;
