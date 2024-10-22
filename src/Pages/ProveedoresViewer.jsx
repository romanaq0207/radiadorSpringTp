import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProveedoresViewer.css";
import { API_BASE_URL } from "../assets/config"; // Asegúrate de que esta ruta sea correcta

const ProveedoresViewer = () => {
  const [proveedores, setProveedores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/proveedores`); // Endpoint de la API para obtener los proveedores
        const proveedoresActivos = response.data.filter(
          (proveedor) => proveedor.activo
        );
        setProveedores(proveedoresActivos);
      } catch (error) {
        console.error("Error al obtener los proveedores de la API:", error);
      }
    };
    fetchProveedores();
  }, []);

  // Función para eliminar un proveedor (cambia su estado activo a false)
  const handleDelete = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/proveedores/${id}/inactivo`);
      setProveedores((prevProveedores) =>
        prevProveedores.filter((proveedor) => proveedor.id_proveedor !== id)
      );
    } catch (error) {
      console.error("Error al cambiar el estado del proveedor:", error);
    }
  };

  // Función para redirigir a la página de edición de proveedores
  const handleEdit = (id) => {
    navigate(`/edit-proveedor/${id}`);
  };

  return (
    <div className="proveedores-viewer">
      <h2>Lista de Proveedores Activos</h2>
      <button
        className="add-button"
        onClick={() => navigate("/agregar-proveedor")}
      >
        Agregar Proveedor
      </button>
      <div className="proveedores-list">
        {proveedores.length === 0 ? (
          <p>No hay proveedores activos disponibles.</p>
        ) : (
          proveedores.map((proveedor) => (
            <div key={proveedor.id_proveedor} className="proveedor-card">
              <h3>{proveedor.nombre}</h3>
              <p>
                <strong>CUIT:</strong> {proveedor.cuil}
              </p>
              <p>
                <strong>Correo electrónico:</strong> {proveedor.email}
              </p>
              <p>
                <strong>Dirección:</strong> {proveedor.direccion}
              </p>
              <p>
                <strong>Teléfono:</strong> {proveedor.telefono}
              </p>
              <div className="action-buttons">
                <button
                  className="edit-button"
                  onClick={() => handleEdit(proveedor.id_proveedor)}
                >
                  Editar
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(proveedor.id_proveedor)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProveedoresViewer;
