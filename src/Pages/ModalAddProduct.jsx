import React, { useState } from "react";
import axios from "axios";
import "./ModalAddProduct.css";
import { API_BASE_URL } from "../assets/config"; // Asegúrate de que esta ruta sea correcta
import Modal from "./ModalExitoAddProduct.jsx";

function ModalAddProduct({ onClose }) {
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    marca: "",
    modelo: "",
    categoria: "",
    cantidad: 0,
    activo: true,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/productos`, formData);
      setShowModal(true);
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
  };

  return (
    <div id="modal-container">
      {showModal && <Modal onClose={() => setShowModal(false)} />}
      <div id="form-product">
        <h2 id="tittle">Agregar Producto</h2>
        <input
          className="input-producto"
          name="nombre"
          placeholder="Producto"
          value={formData.nombre}
          onChange={handleInputChange}
        />
        <input
          className="input-producto"
          name="marca"
          placeholder="Marca"
          value={formData.marca}
          onChange={handleInputChange}
        />
        <input
          className="input-producto"
          name="modelo"
          placeholder="Modelo"
          value={formData.modelo}
          onChange={handleInputChange}
        />
        <select
          id="modal-select-categoria"
          name="categoria"
          value={formData.categoria}
          onChange={handleInputChange}
        >
          <option value="">Selecciona una categoría</option>
          <option value="Aire acondicionado">Aire acondicionado</option>
          <option value="Amortiguadores">Amortiguadores</option>
          <option value="Baterias">Baterías</option>
          <option value="Correas">Correas</option>
          <option value="Cristales">Cristales</option>
          <option value="Direccion">Dirección</option>
          <option value="Escape">Escape</option>
          <option value="Espejos">Espejos</option>
          <option value="Filtros">Filtros</option>
          <option value="Frenos">Frenos</option>
          <option value="Lubricantes">Lubricantes</option>
          <option value="Luces">Luces</option>
          <option value="Motores">Motores</option>
          <option value="Neumaticos">Neumáticos</option>
          <option value="Paragolpes">Paragolpes</option>
          <option value="Radiadores">Radiadores</option>
          <option value="Sistemas electricos">Sistemas eléctricos</option>
          <option value="Sensores">Sensores</option>
          <option value="Suspencion">Suspensión</option>
          <option value="Transmision">Transmisión</option>
        </select>
        <input
          className="input-producto"
          name="cantidad"
          type="number"
          placeholder="Cantidad"
          value={formData.cantidad}
          onChange={handleInputChange}
        />
        <button id="btn-add-producto" onClick={handleSubmit}>
          Agregar
        </button>
        <button onClick={onClose} id="btn-close-modal">
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default ModalAddProduct;
