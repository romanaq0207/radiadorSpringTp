import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faBan } from "@fortawesome/free-solid-svg-icons";
import "./EditProveedor.css";
import { API_BASE_URL } from "../assets/config"; // Asegúrate de que esta ruta sea correcta
import Swal from "sweetalert2";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";

const EditProveedor = () => {
  const { id } = useParams();
  const [proveedor, setProveedor] = useState(null);
  const [originalCuil, setOriginalCuil] = useState(""); // Estado para el CUIT original
  const [errors, setErrors] = useState({});
  const [suggestionsDireccion, setSuggestionsDireccion] = useState([]);
  const [direccionCoords, setDireccionCoords] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProveedor = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/proveedores/${id}`);
        if (response.data) {
          setProveedor(response.data);
          setOriginalCuil(response.data.cuil); // Guardar el CUIT original
        }
      } catch (error) {
        console.error("Error al obtener el proveedor de la API:", error);
      }
    };
    fetchProveedor();
  }, [id]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setProveedor({ ...proveedor, direccion: value });
    handleAutocomplete(value, setSuggestionsDireccion);
  };
  const handleAutocomplete = async (query, setSuggestions) => {
    if (query.length > 3) {
      const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
        query
      )}&countrycodes=AR&limit=5`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.length > 0) {
          setSuggestions(data);
        }
      } catch (error) {
        console.error("Error fetching autocomplete suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };
  const handleSuggestionClick = (
    suggestion,
    setCoords,
    setSuggestions,
    field
  ) => {
    const { lat, lon, display_name } = suggestion;
    setCoords({ lat, lon });
    setProveedor((prev) => ({ ...prev, [field]: display_name }));
    setSuggestions([]);
  };

  const validate = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-Z\s]+$/;
    const cuilRegex = /^\d{2}-\d{8}-\d{1}$/;
    const addressRegex = /^[A-Za-záéíóúÁÉÍÓÚñÑäöüÄÖÜß0-9\s,\.]+$/;
    const phoneRegex = /^\d{8}$|^\d{10}$/;

    if (!proveedor.nombre || !nameRegex.test(proveedor.nombre)) {
      newErrors.nombre = "El nombre solo debe contener letras y espacios.";
    }
    if (!proveedor.cuil || !cuilRegex.test(proveedor.cuil)) {
      newErrors.cuil = "El CUIL debe seguir el formato 12-34567890-1.";
    }
    if (!proveedor.email) {
      newErrors.email = "El correo es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(proveedor.email)) {
      newErrors.email = "El correo no es válido.";
    }
    if (!proveedor.direccion || !addressRegex.test(proveedor.direccion)) {
      newErrors.direccion =
        "La dirección solo debe contener letras, números y espacios.";
    }
    if (!proveedor.telefono || !phoneRegex.test(proveedor.telefono)) {
      newErrors.telefono =
        "Ingrese un número de telefono válido para la Rep. Argentina";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      try {
        // Verificar si el CUIT fue modificado
        if (proveedor.cuil !== originalCuil) {
          // Validar existencia solo si el CUIT es diferente al original
          const response = await axios.get(
            `${API_BASE_URL}/proveedores/cuil/${proveedor.cuil}`
          );
          const proveedorExistente = response.data;

          if (proveedorExistente) {
            await Swal.fire({
              title: "CUIT existente",
              text: "Ya existe otro proveedor con este CUIT.",
              icon: "warning",
              confirmButtonText: "Aceptar",
            });
            return; // No procede con la edición si existe otro proveedor con el mismo CUIT
          }
        }

        // Si no hay duplicados o el CUIT no cambió, proceder con la actualización
        const url = `${API_BASE_URL}/proveedores/modificar-proveedor/${id}`;
        await axios.put(url, proveedor);

        Swal.fire({
          title: "¡Actualización exitosa!",
          text: "La información del proveedor se ha actualizado correctamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        navigate("/gestion-proveedores"); // Redirigir después de guardar
      } catch (error) {
        console.error("Error al guardar los cambios del proveedor:", error);
        Swal.fire({
          title: "¡Error!",
          text: "Hubo un problema al guardar los cambios.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    }
  };

  if (!proveedor) {
    return <p>Proveedor no encontrado</p>;
  }

  const handleBack = () => {
    navigate("/gestion-proveedores");
  };

  return (
    <div className="add-proveedor-container">
      <h2>Editar Proveedor</h2>
      <form className="add-proveedor-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            value={proveedor.nombre}
            onChange={(e) =>
              setProveedor({ ...proveedor, nombre: e.target.value })
            }
            required
          />
          {errors.nombre && <span className="error">{errors.nombre}</span>}
        </div>
        <div className="form-group">
          <label>CUIL:</label>
          <input
            type="text"
            value={proveedor.cuil}
            onChange={(e) =>
              setProveedor({ ...proveedor, cuil: e.target.value })
            }
            required
          />
          {errors.cuil && <span className="error">{errors.cuil}</span>}
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={proveedor.email}
            onChange={(e) =>
              setProveedor({ ...proveedor, email: e.target.value })
            }
            required
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label>Dirección:</label>
          <input
            type="text"
            name="direccion"
            value={proveedor.direccion}
            onChange={handleInputChange}
            required
            className="input-dir-porveedor"
          />
          {suggestionsDireccion.length > 0 && (
            <ul className="suggestions-edit-proveedor">
              {suggestionsDireccion.map((suggestion, index) => (
                <li
                  className="li-edit-proveedor-dir"
                  key={index}
                  onClick={() =>
                    handleSuggestionClick(
                      suggestion,
                      setDireccionCoords,
                      setSuggestionsDireccion,
                      "direccion"
                    )
                  }
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="form-group">
          <label>Teléfono:</label>
          <input
            type="tel"
            value={proveedor.telefono}
            onChange={(e) =>
              setProveedor({ ...proveedor, telefono: e.target.value })
            }
            required
          />
          {errors.telefono && <span className="error">{errors.telefono}</span>}
        </div>
        <button type="submit" className="submit-button">
          <FontAwesomeIcon icon={faFloppyDisk} style={{ color: "#ffffff" }} />
        </button>
        <button onClick={handleBack} id="btn-cancelar">
          <FontAwesomeIcon icon={faBan} style={{ color: "#ffffff" }} />
        </button>
      </form>
    </div>
  );
};

export default EditProveedor;
