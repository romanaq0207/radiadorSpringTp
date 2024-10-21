import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditProducto.css";
import { API_BASE_URL } from "../assets/config"; // Asegúrate de que esta ruta sea correcta

const EditProducto = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/productos/${id}`);
        if (response.data) {
          setProducto(response.data);
        }
      } catch (error) {
        console.error("Error al obtener el producto de la API:", error);
      }
    };
    fetchProducto();
  }, [id]);

  const validate = () => {
    const newErrors = {};
    if (!producto.nombre) {
      newErrors.nombre = "El nombre es obligatorio.";
    }
    if (!producto.marca) {
      newErrors.marca = "La marca es obligatoria.";
    }
    if (!producto.modelo) {
      newErrors.modelo = "El modelo es obligatorio.";
    }
    if (!producto.categoria) {
      newErrors.categoria = "La categoría es obligatoria.";
    }
    if (!producto.cantidad || isNaN(producto.cantidad)) {
      newErrors.cantidad = "La cantidad debe ser un número.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      try {
        await axios.put(`${API_BASE_URL}/productos/${id}`, {
          nombre: producto.nombre,
          marca: producto.marca,
          modelo: producto.modelo,
          categoria: producto.categoria,
          cantidad: producto.cantidad,
          activo: producto.activo, // Asegúrate de enviar el campo 'activo' también
        });
        console.log("Cambios guardados:", producto);
        navigate("/productos"); // Redirect after saving
      } catch (error) {
        console.error("Error al guardar los cambios del producto:", error);
      }
    }
  };

  const handleBack = () => {
    navigate("/productos");
  };

  if (!producto) {
    return <p>Producto no encontrado</p>;
  }

  return (
    <div className="edit-producto-container">
      <h2>Modificar Producto</h2>
      <form className="edit-producto-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            className="input-item"
            type="text"
            value={producto.nombre}
            onChange={(e) =>
              setProducto({ ...producto, nombre: e.target.value })
            }
            required
          />
          {errors.nombre && <span className="error">{errors.nombre}</span>}
        </div>
        <div className="form-group">
          <label>Marca:</label>
          <input
            className="input-item"
            type="text"
            value={producto.marca}
            onChange={(e) =>
              setProducto({ ...producto, marca: e.target.value })
            }
            required
          />
          {errors.marca && <span className="error">{errors.marca}</span>}
        </div>
        <div className="form-group">
          <label>Modelo:</label>
          <input
            className="input-item"
            type="text"
            value={producto.modelo}
            onChange={(e) =>
              setProducto({ ...producto, modelo: e.target.value })
            }
            required
          />
          {errors.modelo && <span className="error">{errors.modelo}</span>}
        </div>
        <div className="form-group">
          <label>Categoría:</label>
          <input
            className="input-item"
            type="text"
            value={producto.categoria}
            onChange={(e) =>
              setProducto({ ...producto, categoria: e.target.value })
            }
            required
          />
          {errors.categoria && (
            <span className="error">{errors.categoria}</span>
          )}
        </div>
        <div className="form-group">
          <label>Cantidad:</label>
          <input
            className="input-item"
            type="text"
            value={producto.cantidad}
            onChange={(e) =>
              setProducto({ ...producto, cantidad: e.target.value })
            }
            required
          />
          {errors.cantidad && <span className="error">{errors.cantidad}</span>}
        </div>
        <button type="submit" className="submit-button">
          Guardar Cambios
        </button>
      </form>
      <p id="back-text" onClick={handleBack}>
        volver...
      </p>
    </div>
  );
};

export default EditProducto;
