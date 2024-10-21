import React, { useState } from "react";
import axios from "axios";
import "./ModalAddProduct.css";
import { API_BASE_URL } from "../assets/config"; // Asegúrate de que esta ruta sea correcta
import Modal from "./ModalExitoAddProduct.jsx";

function ModalAddProduct({ onClose }) {
  const [showModal, setShowModal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

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
      setIsDisabled(true);
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
  };

  // const handleShowModel = () => {
  //   setShowModal(true);
  //   setIsDisabled(true);
  // };

  return (
    <div id="modal-container">
      {showModal && (
        <Modal
          onClose={() => {
            setIsDisabled(false);
            setShowModal(false);
          }}
        />
      )}
      <div id="form-product">
        <h2 id="tittle">Agregar Producto</h2>
        <input
          className="input-producto"
          name="nombre"
          pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑäöüÄÖÜß0-9\s.,\-&!/%#]+$"
          title="Solo se permiten letras, números y caracteres especiales."
          placeholder="Producto"
          value={formData.nombre}
          disabled={isDisabled}
          onChange={handleInputChange}
          required
        />
        <input
          className="input-producto"
          name="marca"
          pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑäöüÄÖÜß0-9\s.,\-&!/%#]+$"
          title="Solo se permiten letras, números y caracteres especiales."
          placeholder="Marca"
          value={formData.marca}
          disabled={isDisabled}
          onChange={handleInputChange}
          required
        />
        <input
          className="input-producto"
          name="modelo"
          pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑäöüÄÖÜß0-9\s.,-]+$"
          title="Solo se permiten letras, números y caracteres especiales."
          placeholder="Modelo"
          value={formData.modelo}
          disabled={isDisabled}
          onChange={handleInputChange}
          required
        />
        <select
          id="modal-select-categoria"
          name="categoria"
          value={formData.categoria}
          disabled={isDisabled}
          onChange={handleInputChange}
          required
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
          min="0"
          step="1"
          placeholder="Cantidad"
          value={formData.cantidad}
          disabled={isDisabled}
          onChange={handleInputChange}
          required
        />
        <button
          id="btn-add-producto"
          disabled={isDisabled}
          onClick={handleSubmit}
        >
          Agregar
        </button>
        <button disabled={isDisabled} onClick={onClose} id="btn-close-modal">
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default ModalAddProduct;
