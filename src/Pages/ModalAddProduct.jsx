import React from "react";
import "./ModalAddProduct.css";

function ModalAddProduct({ onClose }) {
  return (
    <div id="modal-container">
      <div id="form-product">
        <h2 id="tittle">Agregar Producto</h2>
        <input className="input-producto" placeholder="Producto"></input>
        <input className="input-producto" placeholder="Marca"></input>
        <input className="input-producto" placeholder="Categoria"></input>
        <select id="modal-select-categoria">
          <option value="Aire acondicionado"> Aire acondicionado</option>
          <option value="Amortiguadores"> Amortiguadores</option>
          <option value="Baterias"> Baterías</option>
          <option value="Correas"> Correas</option>
          <option value="Cristales"> Cristales</option>
          <option value="Direccion"> Dirección</option>
          <option value="Escape"> Escape</option>
          <option value="Espejos"> Espejos</option>
          <option value="Filtros"> Filtros</option>
          <option value="Frenos"> Frenos</option>
          <option value="Lubricantes"> Lubricantes</option>
          <option value="Luces"> Luces</option>
          <option value="Motores"> Motores</option>
          <option value="Neumaticos"> Neumáticos</option>
          <option value="Paragolpes"> Paragolpes</option>
          <option value="Radiadores"> Radiadores</option>
          <option value="Sistemas electricos"> Sistemas eléctricos</option>
          <option value="Sensores"> Sensores</option>
          <option value="Suspencion"> Suspensión</option>
          <option value="Transmision"> Transmisión</option>
        </select>
        <button id="btn-add-producto">Agregar</button>
        <button onClick={onClose} id="btn-close-modal">
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default ModalAddProduct;
