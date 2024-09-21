import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import "./MyBills.css";

function MyBills() {
  const navigate = useNavigate();
  const handleAddController = () => {
    navigate("/agregar-gastos");
  };
  const [gastos, setGastos] = useState([]);

  useEffect(() => {
    fetch("src/data/gastos.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setGastos(data))
      .catch((error) => console.error("Error al leer el JSON:", error));
  }, []);

  return (
    <div className="my-bills-container">
      <Navbar />
      <h1 id="listaGastos">Lista de Gastos</h1>{" "}
      <button onClick={handleAddController} className="add-button">
        Agregar gasto
      </button>
      <ul className="lista" id="lista">
        {gastos.map((gasto, index) => (
          <div key={index} className="gasto-item">
            <strong>Descripción:</strong> {gasto.descripcion} <br />
            <strong>Monto:</strong> ${gasto.monto} <br />
            <strong>Fecha:</strong> {gasto.fecha}
            <br />
          </div>
        ))}
      </ul>
    </div>
  );
}

export default MyBills;
