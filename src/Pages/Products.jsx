import React, { useState, useEffect } from "react";
import productos from "../data/productos.json";
import "./Products.css"; // Importa el CSS específico para este componente
import Modal from "./ModalAddProduct.jsx";

function Products() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState("Todos los productos");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setRows(productos);
  }, []);

  useEffect(() => {
    if (selectedCategoria === "Todos los productos") {
      setFilteredRows(rows);
    } else {
      setFilteredRows(rows.filter((row) => row.categoria === selectedCategoria));
    }
  }, [selectedCategoria, rows]);

  const handleShowModel = () => {
    setShowModal(true);
  };

  const handleCategoriaChange = (e) => {
    setSelectedCategoria(e.target.value);
  };

  return (
    <div className="productos-container">
      <h2 id="title-productos">Productos</h2>

      <div id="opcions-container">
        <button id="abrir-add-product" onClick={handleShowModel}>
          Agregar producto
        </button>
        {showModal && <Modal onClose={() => setShowModal(false)} />}

        <select id="select-categoria" onChange={handleCategoriaChange}>
          <option value="Todos los productos"> Todos los productos</option>
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
      </div>

      <div className="product-table">
        {filteredRows.length > 0 ? (
          <table className="table-productos">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Marca</th>
                <th>Categoria</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((rows, index) => (
                <tr key={index}>
                  <td>{rows.producto}</td>
                  <td>{rows.marca}</td>
                  <td>{rows.categoria}</td>
                  <td>{rows.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No se encontraron productos</p>
        )}
      </div>
    </div>
  );
}

export default Products;
