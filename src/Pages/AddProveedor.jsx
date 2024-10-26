import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddProveedor.css";
import { API_BASE_URL } from "../assets/config"; // Asegúrate de que esta ruta sea correcta

const AddProveedor = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    cuil: "",
    email: "",
    direccion: "",
    telefono: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Función para manejar los cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validaciones
  const validate = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-Z\s]+$/; // Solo letras y espacios
    const cuilRegex = /^\d{2}-\d{8}-\d{1}$/; // CUIL en formato nn-nnnnnnnn-n
    const addressRegex = /^[A-Za-záéíóúÁÉÍÓÚñÑäöüÄÖÜß0-9\s,]+$/; // Letras, números, comas y espacios
    const phoneRegex = /^\d{8}$|^\d{10}$/; // 8 o 10 dígitos para teléfono
    if (!formData.nombre || !nameRegex.test(formData.nombre)) {
      newErrors.nombre = "El nombre solo debe contener letras y espacios.";
    }
    if (!formData.cuil || !cuilRegex.test(formData.cuil)) {
      newErrors.cuil = "El CUIL debe seguir el formato 12-34567890-1.";
    }
    if (!formData.email) {
      newErrors.email = "El correo es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El correo no es válido.";
    }
    if (!formData.direccion || !addressRegex.test(formData.direccion)) {
      newErrors.direccion =
        "La dirección solo debe contener letras, números y espacios.";
    }
    if (!formData.telefono || !phoneRegex.test(formData.telefono)) {
      newErrors.telefono =
        "Ingrese un número de telefono válido para la Rep. Argentina";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await axios.post(`${API_BASE_URL}/proveedores`, {
          ...formData,
          activo: true,
        });
        navigate("/"); // Navega de vuelta a la lista de proveedores activos
      } catch (error) {
        console.error(
          "Error al agregar el proveedor a la base de datos:",
          error
        );
      }
    }
  };
  const handleBack = () => {
    navigate("/gestion-proveedores");
  };

  return (
    <div className="add-proveedor-container">
      <h2>Agregar Nuevo Proveedor</h2>
      <form className="add-proveedor-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
          />
          {errors.nombre && <span className="error">{errors.nombre}</span>}
        </div>
        <div className="form-group">
          <label>CUIT:</label>
          <input
            type="text"
            name="cuil"
            value={formData.cuil}
            onChange={handleInputChange}
            required
          />
          {errors.cuil && <span className="error">{errors.cuil}</span>}
        </div>
        <div className="form-group">
          <label>Correo electrónico:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label>Dirección:</label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleInputChange}
            required
          />
          {errors.direccion && (
            <span className="error">{errors.direccion}</span>
          )}
        </div>
        <div className="form-group">
          <label>Teléfono:</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleInputChange}
            required
          />
          {errors.telefono && <span className="error">{errors.telefono}</span>}
        </div>
        <button type="submit" className="submit-button">
          Agregar Proveedor
        </button>
        <button onClick={handleBack} className="btn-cancelar">
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default AddProveedor;
