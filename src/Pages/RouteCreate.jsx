import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import "./RouteCreate.css";

function RouteCreate() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const routingControlRef = useRef(null); // Control de routing
  const [rutaData, setRutaData] = useState({
    desde: "",
    hasta: "",
    conductor: "",
    conductorDni: "",
  });

  const [desdeCoords, setDesdeCoords] = useState(null);
  const [hastaCoords, setHastaCoords] = useState(null);
  const [suggestionsDesde, setSuggestionsDesde] = useState([]);
  const [suggestionsHasta, setSuggestionsHasta] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRutaData({ ...rutaData, [name]: value });

    if (name === "desde") {
      handleAutocomplete(value, setSuggestionsDesde);
    } else if (name === "hasta") {
      handleAutocomplete(value, setSuggestionsHasta);
    }
  };

  const handleAddRoute = async (e) => {
    e.preventDefault();
    if (!desdeCoords || !hastaCoords) {
      alert("Una o ambas ubicaciones no han sido seleccionadas.");
      return;
    }
    // Geocodificar y crear ruta
    geocodeAndCreateRoute(desdeCoords, hastaCoords);
  };

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map", {
        center: [51.505, -0.09],
        zoom: 13,
        zoomControl: true,
        dragging: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }
  }, []);

  const geocodeAndCreateRoute = async (desdeCoords, hastaCoords) => {
    if (mapRef.current) {
      if (routingControlRef.current) {
        mapRef.current.removeControl(routingControlRef.current); // Eliminar la ruta anterior
      }

      routingControlRef.current = L.Routing.control({
        waypoints: [
          L.latLng(desdeCoords.lat, desdeCoords.lon),
          L.latLng(hastaCoords.lat, hastaCoords.lon),
        ],
        routeWhileDragging: true,
        show: false, // Oculta el panel de instrucciones de ruta
      }).addTo(mapRef.current);

      // Añadir marcadores
      L.marker([desdeCoords.lat, desdeCoords.lon]).addTo(mapRef.current);
      L.marker([hastaCoords.lat, hastaCoords.lon]).addTo(mapRef.current);

      alert("Ruta creada con éxito");
    } else {
      alert("Hubo un problema al generar el mapa.");
    }
  };

  const handleAutocomplete = async (query, setSuggestions) => {
    if (query.length > 3) {
      const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(query)}&countrycodes=AR&limit=5`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.length > 0) {
          setSuggestions(data);
        }
      } catch (error) {
        console.error("Error fetching autocomplete suggestions:", error);
      }
    }
  };

  const handleSuggestionClick = (suggestion, setCoords, setSuggestions, field) => {
    const { lat, lon, display_name } = suggestion;
    setCoords({ lat, lon });
    setRutaData((prev) => ({ ...prev, [field]: display_name }));
    setSuggestions([]);
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
        {suggestionsDesde.length > 0 && (
          <ul className="suggestions">
            {suggestionsDesde.map((suggestion, index) => (
              <li
                key={index}
                onClick={() =>
                  handleSuggestionClick(suggestion, setDesdeCoords, setSuggestionsDesde, "desde")
                }
              >
                {suggestion.display_name}
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
        {suggestionsHasta.length > 0 && (
          <ul className="suggestions">
            {suggestionsHasta.map((suggestion, index) => (
              <li
                key={index}
                onClick={() =>
                  handleSuggestionClick(suggestion, setHastaCoords, setSuggestionsHasta, "hasta")
                }
              >
                {suggestion.display_name}
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
