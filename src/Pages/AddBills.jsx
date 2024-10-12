import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../assets/config";
import "./AddBills.css";
import { useNavigate } from "react-router-dom";

function MyBills() {
  const navigate = useNavigate();
  const [billsData, setBillsData] = useState({
    descripcion: "",
    monto: "",
    fecha: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillsData({ ...billsData, [name]: value });
  };

  const handleAddBills = () => {
    const billData = { ...billsData, estado: 'pendiente' }; // Agregar estado por defecto
    axios
      .post(`${API_BASE_URL}/bills`, billData)
      .then((response) => {
        console.log("Gasto agregado:", response.data);
        navigate("/"); // Redirige a la página principal
      })
      .catch((error) => {
        console.error("Error al agregar el gasto:", error);
      });
};


  const handleReturnHome = () => {
    navigate("/mis-gastos");
  };

  return (
    <div className="add-bills-container">
      <h2>Agregar un nuevo Gasto</h2>
      <input
        type="text"
        name="descripcion"
        placeholder="Descripción"
        value={billsData.descripcion}
        onChange={handleInputChange}
      />
      <input
        type="number"
        name="monto"
        placeholder="1000.00$"
        value={billsData.monto}
        onChange={handleInputChange}
      />
      <input
        type="date"
        name="fecha"
        value={billsData.fecha}
        onChange={handleInputChange}
      />
      <button onClick={handleAddBills}>Cargar gasto</button>
      <button onClick={handleReturnHome} id="cancelar">
        Cancelar
      </button>
    </div>
  );
}

export default MyBills;
