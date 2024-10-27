import React, { useState, useEffect } from "react";
import conductoresData from "../data/conductores.json";
import "./DriversManagement.css"; // Importa el CSS específico para este componente
import { API_BASE_URL } from "../assets/config";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash,faLocationDot} from '@fortawesome/free-solid-svg-icons';
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const DriversManagement = () => {
  const [conductores, setConductores] = useState([]);
  const [ubicaciones, setUbicaciones] = useState({});

  useEffect(() => {
    setConductores(conductoresData.filter((conductor) => conductor.habilitado));
  }, []);

  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    apellido: "",
    dni: "",
    numeroTelefono: "",
    habilitado: true,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const dniRegex = /^(\d{1,2}\.?\d{3}\.?\d{3}|\d{1,8})$/;
    const phoneRegex = /^\d{8}|\d{10}$/;

    if (!nameRegex.test(formData.nombre)) {
      alert("El nombre solo puede contener letras y espacios.");
      return;
    }

    if (!nameRegex.test(formData.apellido)) {
      alert("El apellido solo puede contener letras y espacios.");
      return;
    }

    if (!dniRegex.test(formData.dni)) {
      alert("El DNI debe tener un formato válido");
      return;
    }

    if (!phoneRegex.test(formData.numeroTelefono)) {
      alert("El número de teléfono debe tener 8 o 10 dígitos.");
      return;
    }

    if (isEditing) {
      setConductores(
        conductores.map((conductor) =>
          conductor.id === formData.id ? formData : conductor
        )
      );
      setIsEditing(false);
    } else {
      setConductores([
        ...conductores,
        { ...formData, id: conductores.length + 1 },
      ]);
    }

    setFormData({
      id: "",
      nombre: "",
      apellido: "",
      dni: "",
      numeroTelefono: "",
      habilitado: true,
    });
  };

  const handleEdit = (id) => {
    const conductor = conductores.find((conductor) => conductor.id === id);
    setFormData(conductor);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    setConductores(
      conductores.map((conductor) =>
        conductor.id === id ? { ...conductor, habilitado: false } : conductor
      )
    );
  };

  const fetchUbicacion = async (id = 1) => {
    try {
      console.log(`Fetching location for id: ${id}`);
      const response = await fetch(`${API_BASE_URL}/ubicacion-conductor`);
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error al obtener la ubicación: ${errorMessage}`);
      }
      const data = await response.json();
      console.log("Ubicación recibida:", data);

      setUbicaciones((prev) => ({ ...prev, [id]: data }));
    } catch (error) {
      console.error("Error al obtener la ubicación:", error);
    }
  };

  // Actualizar ubicación cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      conductores.forEach((conductor) => fetchUbicacion(conductor.id));
    }, 160000);

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
  }, [conductores]);

  const handleCancel = () => {
    setFormData({
      id: "",
      nombre: "",
      apellido: "",
      dni: "",
      numeroTelefono: "",
      habilitado: true,
    });
    setIsEditing(false);
  };

  return (
    <div className="drivers-management-container">
      <div className="filter-container">
        <h2 className="title">Gestión de Conductores</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="dni"
            placeholder="DNI"
            value={formData.dni}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="numeroTelefono"
            placeholder="Número de Teléfono"
            value={formData.numeroTelefono}
            onChange={handleChange}
            required
          />
          <button type="submit" className="add-button">
            {isEditing ? "Modificar Conductor" : "+"}
          </button>
          <button
            onClick={handleCancel}
            disabled={!isEditing}
            className="btn-cancelar-conductores"
          >
            Cancelar
          </button>
        </form>
      </div>

      <div className="drivers-list">
        {conductores
          .filter((conductor) => conductor.habilitado)
          .map((conductor) => (
            <div key={conductor.id} className="drivers-card" id="drivers-card">
              <p>
                <strong>Nombre:</strong> {conductor.nombre} {conductor.apellido}
              </p>
              <p>
                <strong>DNI:</strong> {conductor.dni}
              </p>
              <p>
                <strong>Teléfono:</strong> {conductor.numeroTelefono}
              </p>

              <button
                onClick={() => handleEdit(conductor.id)}
                className="add-button"
              >
                <FontAwesomeIcon icon={faPenToSquare} style={{color: "#ffffff",}} />
              </button>
              <button
                onClick={() => handleDelete(conductor.id)}
                className="add-button"
              >
                <FontAwesomeIcon icon={faTrash} style={{color: "#ffffff",}} />
              </button>
              <button
                onClick={() => fetchUbicacion(conductor.id)}
                className="add-button"
              >
                <FontAwesomeIcon icon={faLocationDot} style={{color: "#ffffff",}} />
              </button>

              {ubicaciones[conductor.id] && (
                <div>
                  <p>
                    <strong>Última Ubicación:</strong>
                  </p>
                  <p>Latitud: {ubicaciones[conductor.id].latitud}</p>
                  <p>Longitud: {ubicaciones[conductor.id].longitud}</p>

                  <MapContainer
                    center={[
                      ubicaciones[conductor.id].latitud,
                      ubicaciones[conductor.id].longitud,
                    ]}
                    zoom={13}
                    style={{ height: "200px", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                    />
                    <Marker
                      position={[
                        ubicaciones[conductor.id].latitud,
                        ubicaciones[conductor.id].longitud,
                      ]}
                    >
                      <Popup>Ubicación actual del conductor</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default DriversManagement;
