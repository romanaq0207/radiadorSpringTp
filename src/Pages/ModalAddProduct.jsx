import React, { useState } from "react";
import axios from "axios";
import "./ModalAddProduct.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import { API_BASE_URL } from "../assets/config";
import Modal from "./ModalExitoAddProduct.jsx";

function ModalAddProduct({ onClose }) {
  const [showModal, setShowModal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    nombre: "",
    marca: "",
    modelo: "",
    categoria: "",
    cantidad: 0,
    activo: true,
  });

  const categoriaMap = {
    "Aire acondicionado": 41,
    "Amortiguadores": 44,
    "Baterias": 48,
    "Correas": 46,
    "Cristales": 52,
    "Direccion": 50,
    "Escape": 47,
    "Espejos": 54,
    "Filtros": 60,
    "Frenos": 45,
    "Lubricantes": 49,
    "Luces": 55,
    "Motores": 56,
    "Neumaticos": 58,
    "Paragolpes": 53,
    "Radiadores": 57,
    "Sistemas electricos": 42,
    "Sensores": 43,
    "Suspencion": 51,
    "Transmision": 59,
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Limpia el error al escribir
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido";
    if (!formData.marca.trim()) newErrors.marca = "La marca es requerida";
    if (!formData.modelo.trim()) newErrors.modelo = "El modelo es requerido";
    if (!formData.categoria) newErrors.categoria = "La categoría es requerida";
    if (formData.cantidad <= 0) newErrors.cantidad = "La cantidad debe ser mayor que 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Si hay errores, no continuar
    try {
      const formDataWithCategoryID = {
        ...formData,
        categoria: categoriaMap[formData.categoria],
      };
      await axios.post(`${API_BASE_URL}/productos`, formDataWithCategoryID);
      setShowModal(true);
      setIsDisabled(true);
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
  };

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
        {errors.nombre && <span className="error-message">{errors.nombre}</span>}

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
        {errors.marca && <span className="error-message">{errors.marca}</span>}

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
        {errors.modelo && <span className="error-message">{errors.modelo}</span>}

        <select
          id="modal-select-categoria"
          name="categoria"
          value={formData.categoria}
          disabled={isDisabled}
          onChange={handleInputChange}
          required
        >
          <option value="">Selecciona una categoría</option>
          {Object.keys(categoriaMap).map((categoria) => (
            <option key={categoria} value={categoria}>{categoria}</option>
          ))}
        </select>
        {errors.categoria && <span className="error-message">{errors.categoria}</span>}

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
        {errors.cantidad && <span className="error-message">{errors.cantidad}</span>}

        <button id="btn-add-producto" disabled={isDisabled} onClick={handleSubmit}>
          +
        </button>
        <button disabled={isDisabled} onClick={onClose} id="btn-close-modal">
          <FontAwesomeIcon icon={faBan} style={{ color: "#ffffff" }} />
        </button>
      </div>
    </div>
  );
}

export default ModalAddProduct;
