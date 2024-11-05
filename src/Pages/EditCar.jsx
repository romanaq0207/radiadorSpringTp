import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { toPng } from "html-to-image";
import "./EditCar.css";
import { API_BASE_URL } from "../assets/config";
import Swal from "sweetalert2";

function EditCar() {
  const { id } = useParams(); // Obtén el ID del auto desde los parámetros de la URL
  const [autoData, setAutoData] = useState({
    marca: "",
    modelo: "",
    anio: "",
    kilometraje: "",
    nro_patente: "",
  });
  const [qrCodeValue, setQrCodeValue] = useState("");
  const qrRef = useRef(null);
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(35), (val, index) => currentYear - index);
  const marcas = [
    "Ford",
    "Mercedez Benz",
    "Volkswagen",
    "Peugeot",
    "Renault",
    "Suzuki",
    "Toyota",
    "Fiat",
  ];

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/autos/${id}`)
      .then((response) => setAutoData(response.data))
      .catch((error) =>
        console.error("Error al obtener los datos del auto:", error)
      );
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAutoData({ ...autoData, [name]: value });
  };
  const handleKilometerChange = (e) => {
    const { value } = e.target;
    if (value >= 0 || value === "") {
      setAutoData({ ...autoData, kilometraje: value });
    }
  };

  const handleUpdateAuto = (e) => {
    e.preventDefault();
    const modeloRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/;
    const patenteRegex = /^([a-zA-Z]{3}\d{3}|[a-zA-Z]{2}\d{3}[a-zA-Z]{2})$/;
  
    if (!modeloRegex.test(autoData.modelo)) {
      alert("El modelo solo puede contener letras, números y espacios.");
      return;
    }
  
    if (!patenteRegex.test(autoData.nro_patente)) {
      alert("El número de patente debe seguir el formato ABC123 o AB123CD.");
      return;
    }
  
    // Verificar si ya existe otro auto con la misma patente
    axios
      .get(`${API_BASE_URL}/autos?patente=${autoData.nro_patente}`)
      .then((response) => {
        const existingAuto = response.data.find((auto) => auto.id !== id);
  
        // Solo mostrar la alerta si hay otro auto con esa patente y no es el auto actual
        if (existingAuto && existingAuto.id !== id) {
          Swal.fire({
            title: "Error",
            text: "Ya existe otro vehículo con esta patente en el sistema.",
            icon: "warning",
            confirmButtonText: "Aceptar",
          });
        } else {
          // Si la patente es única, proceder a actualizar el auto
          axios
            .put(`${API_BASE_URL}/autos/${id}`, autoData)
            .then(() => {
              const qrUrl = `${API_BASE_URL}/autos/${id}`;
              setQrCodeValue(qrUrl);
  
              Swal.fire({
                title: "¡Actualización exitosa!",
                text: "La información del auto se ha actualizado correctamente.",
                icon: "success",
                confirmButtonText: '<i class="fas fa-check"></i> Aceptar',
                customClass: {
                  confirmButton: "swal-confirm-button",
                },
              }).then(() => {
                navigate("/gestion-autos");
              });
            })
            .catch((error) => {
              console.error("Error al actualizar el auto:", error);
              Swal.fire({
                title: "¡Error!",
                text: "No se pudo modificar los datos del auto en el sistema.",
                icon: "error",
                confirmButtonText: "Aceptar",
              }).then(() => {
                navigate("/gestion-autos");
              });
            });
        }
      })
      .catch((error) => {
        console.error("Error al verificar existencia del auto:", error);
        Swal.fire({
          title: "¡Error!",
          text: "Hubo un problema al verificar la patente.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      });
  };
  
  
  const handleDownloadQR = () => {
    if (qrRef.current) {
      toPng(qrRef.current)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `${autoData.nro_patente}-qr-code.png`;
          link.click();
        })
        .catch((error) =>
          console.error("Error al generar la imagen QR:", error)
        );
    }
  };

  const handleVolver = () => {
    navigate("../gestion-autos");
  };

  return (
    <div className="edit-car">
      <h2>Editar Auto</h2>
      <select
        name="marca"
        value={autoData.marca}
        onChange={handleInputChange}
        required
        className="input-edit-car"
      >
        {" "}
        <option value="" disabled>
          {" "}
          Selecciona la marca del vehículo{" "}
        </option>{" "}
        {marcas.map((marca) => (
          <option key={marca} value={marca}>
            {" "}
            {marca}{" "}
          </option>
        ))}{" "}
      </select>
      <input
        type="text"
        name="modelo"
        placeholder="Modelo"
        value={autoData.modelo}
        onChange={handleInputChange}
        className="input-edit-car"
        required
      />
      <select
        name="anio"
        value={autoData.anio}
        onChange={handleInputChange}
        className="input-edit-car"
        required
      >
        {" "}
        <option value="" disabled>
          {" "}
          Selecciona el año del modelo{" "}
        </option>{" "}
        {years.map((year) => (
          <option key={year} value={year}>
            {" "}
            {year}{" "}
          </option>
        ))}{" "}
      </select>
      <input
        type="text"
        name="kilometraje"
        placeholder="Kilometraje"
        value={autoData.kilometraje}
        onChange={handleKilometerChange}
        className="input-edit-car"
        required
      />
      <input
        type="text"
        name="nro_patente"
        placeholder="Número de Patente"
        value={autoData.nro_patente}
        onChange={handleInputChange}
        className="input-edit-car"
        required
      />
      <button onClick={handleUpdateAuto} className="btn-edit-auto">
        <FontAwesomeIcon icon={faFloppyDisk} style={{ color: "#ffffff" }} />
      </button>
      <button onClick={handleVolver} className="btn-back-edit-auto">
        Volver
      </button>

      {qrCodeValue && (
        <div>
          <div ref={qrRef}>
            <QRCode
              value={qrCodeValue}
              size={256}
              bgColor="white"
              fgColor="black"
              level="H"
            />
          </div>
          <button onClick={handleDownloadQR}>Descargar QR como imagen</button>
        </div>
      )}
    </div>
  );
}

export default EditCar;
