import React, { useState } from "react";
import axios from "axios";
import "./ModalAddProduct.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { API_BASE_URL } from "../assets/config";
import Modal from "./ModalExitoAddProduct.jsx";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function ModalAddProduct({ onClose }) {
  const [showModal, setShowModal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [error, setError] = useState(""); // Solo un mensaje de error
  const navigate = useNavigate();
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
    Amortiguadores: 44,
    Baterias: 48,
    Correas: 46,
    Cristales: 52,
    Direccion: 50,
    Escape: 47,
    Espejos: 54,
    Filtros: 60,
    Frenos: 45,
    Lubricantes: 49,
    Luces: 55,
    Motores: 56,
    Neumaticos: 58,
    Paragolpes: 53,
    Radiadores: 57,
    "Sistemas electricos": 42,
    Sensores: 43,
    Suspencion: 51,
    Transmision: 59,
  };

  const handleCantChange = (e) => {
    const { value } = e.target;
    if (value >= 0 || value === "") {
      setFormData({ ...formData, cantidad: value });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validación de campo modelo solo con letras y tildes
    if (name === "modelo" && !/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
      setError("El modelo solo puede contener letras.");
    } else if (!value.trim()) {
      setError(`El campo ${name} es obligatorio.`);
    } else {
      setError("");
    }
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      return setError("El nombre del producto es obligatorio.");
    }
    if (!formData.marca.trim()) {
      return setError("La marca es obligatoria.");
    }
    if (!formData.modelo.trim()) {
      return setError("El modelo es obligatorio.");
    }
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(formData.modelo)) {
      return setError("El modelo solo puede contener letras.");
    }
    if (
      !formData.categoria ||
      formData.categoria === "Selecciona una categoría"
    ) {
      return setError("La categoría es obligatoria.");
    }
    if (formData.cantidad <= 0) {
      return setError("La cantidad debe ser mayor que 0.");
    }
    setError("");
    return true;
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
      Swal.fire({
        title: "¡Éxito!",
        text: "Se agrego el nuevo producto correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
        customClass: {
          container: "my-swal",
        },
      });
      navigate("/productos");
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
          placeholder="Producto"
          value={formData.nombre}
          disabled={isDisabled}
          onChange={handleInputChange}
          required
        />
        <input
          className="input-producto"
          name="marca"
          placeholder="Marca"
          value={formData.marca}
          disabled={isDisabled}
          onChange={handleInputChange}
          required
        />
        <input
          className="input-producto"
          name="modelo"
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
          {Object.keys(categoriaMap).map((categoria) => (
            <option key={categoria} value={categoria}>
              {categoria}
            </option>
          ))}
        </select>
        <input
          className="input-producto"
          name="cantidad"
          type="text"
          placeholder="Cantidad"
          value={formData.cantidad}
          disabled={isDisabled}
          onChange={handleCantChange}
          required
        />
        {error && <span className="error-message">{error}</span>}{" "}
        {/* Solo un mensaje de error */}
        <button
          id="btn-add-producto"
          disabled={isDisabled}
          onClick={handleSubmit}
        >
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
