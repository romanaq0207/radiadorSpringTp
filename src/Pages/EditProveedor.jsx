import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddProveedor.css";
import { API_BASE_URL } from '../assets/config'; // Asegúrate de que esta ruta sea correcta

const EditProveedor = () => {
  const { id } = useParams();
  const [proveedor, setProveedor] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProveedor = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/proveedores/${id}`);
        if (response.data) {
          setProveedor(response.data);
        }
      } catch (error) {
        console.error("Error al obtener el proveedor de la API:", error);
      }
    };
    fetchProveedor();
  }, [id]);

  const validate = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-Z\s]+$/;
    const cuilRegex = /^\d{2}-\d{8}-\d{1}$/;
    const addressRegex = /^[A-Za-z0-9\s,]+$/;
    const phoneRegex = /^\d{8}$|^\d{10}$/;
    if (!proveedor.nombre || !nameRegex.test(proveedor.nombre)) {
      newErrors.nombre = 'El nombre solo debe contener letras y espacios.';
    }
    if (!proveedor.cuil || !cuilRegex.test(proveedor.cuil)) {
      newErrors.cuil = 'El CUIL debe seguir el formato 12-34567890-1.';
    }
    if (!proveedor.email) {
      newErrors.email = 'El correo es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(proveedor.email)) {
      newErrors.email = 'El correo no es válido.';
    }
    if (!proveedor.direccion || !addressRegex.test(proveedor.direccion)) {
      newErrors.direccion = 'La dirección solo debe contener letras, números y espacios.';
    }
    if (!proveedor.telefono || !phoneRegex.test(proveedor.telefono)) {
      newErrors.telefono = 'Ingrese un número de telefono válido para la Rep. Argentina';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      try {
        await axios.put(`${API_BASE_URL}/proveedores/${id}`, proveedor);
        console.log("Cambios guardados:", proveedor);
        navigate("/"); // Redirect after saving
      } catch (error) {
        console.error("Error al guardar los cambios del proveedor:", error);
      }
    }
  };

  if (!proveedor) {
    return <p>Proveedor no encontrado</p>;
  }

  return (
    <div className="add-proveedor-container">
      <h2>Editar Proveedor</h2>
      <form className="add-proveedor-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            value={proveedor.nombre}
            onChange={(e) => setProveedor({ ...proveedor, nombre: e.target.value })}
            required
          />
          {errors.nombre && <span className="error">{errors.nombre}</span>}
        </div>
        <div className="form-group">
          <label>CUIL:</label>
          <input
            type="text"
            value={proveedor.cuil}
            onChange={(e) => setProveedor({ ...proveedor, cuil: e.target.value })}
            required
          />
          {errors.cuil && <span className="error">{errors.cuil}</span>}
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={proveedor.email}
            onChange={(e) => setProveedor({ ...proveedor, email: e.target.value })}
            required
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label>Dirección:</label>
          <input
            type="text"
            value={proveedor.direccion}
            onChange={(e) => setProveedor({ ...proveedor, direccion: e.target.value })}
            required
          />
          {errors.direccion && <span className="error">{errors.direccion}</span>}
        </div>
        <div className="form-group">
          <label>Teléfono:</label>
          <input
            type="tel"
            value={proveedor.telefono}
            onChange={(e) => setProveedor({ ...proveedor, telefono: e.target.value })}
            required
          />
          {errors.telefono && <span className="error">{errors.telefono}</span>}
        </div>
        <button type="submit" className="submit-button">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditProveedor;
