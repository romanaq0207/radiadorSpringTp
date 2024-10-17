import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Products.css";
import Modal from "./ModalAddProduct.jsx";
import { API_BASE_URL } from '../assets/config'; 

function Products() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState("Todos los productos");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/productos`);
        setRows(response.data);
      } catch (error) {
        console.error("Error al obtener los productos de la API:", error);
      }
    };
    fetchProductos();
  }, []);

  useEffect(() => {
    const filterRows = () => {
      if (selectedCategoria === "Todos los productos") {
        setFilteredRows(rows.filter(row => row.activo));
      } else {
        setFilteredRows(rows.filter(row => row.categoria === selectedCategoria && row.activo));
      }
    };
    filterRows();
  }, [selectedCategoria, rows]);

  const handleShowModel = () => {
    setShowModal(true);
  };

  const handleCategoriaChange = (e) => {
    setSelectedCategoria(e.target.value);
  };

  const handleEdit = (id) => {
    navigate(`/edit-producto/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/productos/${id}/inactivo`);
      // Actualizar el estado local para reflejar los cambios
      setRows((prevRows) => prevRows.map((row) =>
        row.id_producto === id ? { ...row, activo: false } : row
      ));
    } catch (error) {
      console.error("Error al cambiar el estado del producto:", error);
    }
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
                <th>Modelo</th>
                <th>Categoria</th>
                <th>Cantidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, index) => (
                <tr key={index}>
                  <td>{row.nombre}</td>
                  <td>{row.marca}</td>
                  <td>{row.modelo}</td>
                  <td>{row.categoria}</td>
                  <td>{row.cantidad}</td>
                  <td>
                    <button className="button button-modificar" onClick={() => handleEdit(row.id_producto)}>Modificar</button>
                    <button className="button button-eliminar" onClick={() => handleDelete(row.id_producto)}>Eliminar</button>
                  </td>
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
