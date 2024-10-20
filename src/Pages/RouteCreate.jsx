import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ejemplo from "./Images/ejemplo-map.jpg";
import "./RouteCreate.css";

function RouteCreate() {
  const navigate = useNavigate();

  const [rutaData, setRutaData] = useState({
    desde: "",
    hasta: "",
    conductor: "",
    conductorDni: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRutaData({ ...rutaData, [name]: value });
  };

  const handleAddRoute = (e) => {
    e.preventDefault();
    alert("Ruta Creada!");
    // Aquí puedes agregar la lógica para enviar los datos a tu API
  };

  return (
    <div className="add-route">
      <h2>Crear Nueva Ruta</h2>
      <form onSubmit={handleAddRoute}>
        <input
          type="text"
          name="desde"
          pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑäöüÄÖÜß0-9\s.,!?;:-]+"
          title="Solo se permiten letras, números y espacios."
          placeholder="Punto de partida"
          value={rutaData.desde}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="hasta"
          pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑäöüÄÖÜß0-9\s.,!?;:-]+"
          title="Solo se permiten letras, números y espacios."
          placeholder="Destino"
          value={rutaData.hasta}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="conductor"
          pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
          title="Solo se permiten letras y espacios."
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
        <img id="mapa" src={ejemplo} alt="Mapa de ejemplo" />
        <input id="submit-ruta" type="submit" value="Cargar Ruta" />
      </form>
    </div>
  );
}

export default RouteCreate;
