import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./Products.css";
import Modal from "./ModalAddProduct.jsx";
import { API_BASE_URL } from "../assets/config";
import Swal from "sweetalert2";

function Products() {
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(
    "Todos los productos"
  );
  const [showModal, setShowModal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const marcas = ["Mercedez Benz", "Volkswagen", "Renault", "Iveco"];
  const modelos = {
    "Mercedez Benz": ["Actros", "Arocs", "Atego", "Econic"],
    Volkswagen: ["Delivery", "Constellation", "Meteor"],
    Renault: ["Master", "Trafic", "D-Truck", "Midlum"],
    Iveco: ["Stralis", "Trakker", "Eurocargo"],
  };
  const [searchMarcaTerm, setSearchMarcaTerm] = useState("Todos los productos");
  const [searchModeloTerm, setSearchModeloTerm] = useState(
    "Todos los productos"
  );
  const [selectedMarca, setSelectedMarca] = useState("");
  const [selectedModelo, setSelectedModelo] = useState("");
  const navigate = useNavigate();

  const fetchProductos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/productos`);
      setRows(response.data);
    } catch (error) {
      console.error("Error al obtener los productos de la API:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    const filterRows = () => {
      let filtered = rows.filter((row) => row.activo);
      if (selectedCategoria !== "Todos los productos") {
        filtered = filtered.filter(
          (row) => row.categoria === selectedCategoria
        );
      }
      if (searchTerm) {
        filtered = filtered.filter((row) =>
          row.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (
        searchMarcaTerm !== "Todos los productos" &&
        searchModeloTerm !== "Todos los productos"
      ) {
        filtered = filtered.filter(
          (row) =>
            row.marca.toLowerCase().includes(searchMarcaTerm.toLowerCase()) &&
            row.modelo.toLowerCase().includes(searchModeloTerm.toLowerCase())
        );
      } else if (
        searchMarcaTerm !== "Todos los productos" &&
        searchModeloTerm === "Todos los productos"
      ) {
        filtered = filtered.filter((row) =>
          row.marca.toLowerCase().includes(searchMarcaTerm.toLowerCase())
        );
      }
      setFilteredRows(filtered);
    };
    filterRows();
  }, [selectedCategoria, searchTerm, rows, searchMarcaTerm, searchModeloTerm]);

  const handleMinStock = () => {
    const sorted = [...rows].sort(
      (rowa, rowb) => rowa.cantidad - rowb.cantidad
    );
    setFilteredRows(sorted);
  };
  const handleMaxStock = () => {
    const sorted = [...rows].sort(
      (rowa, rowb) => rowb.cantidad - rowa.cantidad
    );
    setFilteredRows(sorted);
  };

  const handleShowModel = () => {
    setShowModal(true);
    setIsDisabled(true);
  };

  const handleCategoriaChange = (e) => {
    setSelectedCategoria(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleMarcaChange = (e) => {
    const marca =
      e.target.value === "" ? "Todos los productos" : e.target.value;
    setSelectedMarca(marca);
    setSelectedModelo("");
    setSearchMarcaTerm(marca);
  };
  const handleModeloChange = (e) => {
    const modelo =
      e.target.value === "" ? "Todos los productos" : e.target.value;
    setSelectedModelo(modelo);
    setSearchModeloTerm(modelo);
  };

  const handleEdit = (id) => {
    navigate(`/edit-producto/${id}`);
  };

  const handleDelete = async (id) => {
    // Primer alerta de confirmación
    const confirmDelete = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmDelete.isConfirmed) {
      // Segunda alerta sobre el impacto en las órdenes de compra
      const confirmImpact = await Swal.fire({
        title: "Advertencia",
        text: "Al eliminar este producto, las ordenes de compran que incluyan este producto quedarán sin efecto. ¿Deseas continuar?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, continuar",
        cancelButtonText: "Cancelar",
      });

      if (confirmImpact.isConfirmed) {
        try {
          await axios.put(`${API_BASE_URL}/productos/${id}/inactivo`);
          // Actualizar el estado local para reflejar los cambios
          setRows((prevRows) =>
            prevRows.map((row) =>
              row.id_producto === id ? { ...row, activo: false } : row
            )
          );
          Swal.fire({
            title: "Eliminado",
            text: "El producto ha sido eliminado exitosamente.",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
        } catch (error) {
          console.error("Error al cambiar el estado del producto:", error);
          Swal.fire({
            title: "Error",
            text: "Hubo un problema al eliminar el producto.",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        }
      }
    }
  };

  return (
    <div className="productos-container">
      <h2 id="title-productos">Productos</h2>
      <div id="opcions-container">
        <button
          id="abrir-add-product"
          disabled={isDisabled}
          onClick={handleShowModel}
        >
          Agregar productos
        </button>
        {showModal && (
          <Modal
            onClose={() => {
              setIsDisabled(false);
              setShowModal(false);
              fetchProductos();
            }}
          />
        )}

        <div className="search-container">
          <i className="material-icons" id="search-icon">
            search
          </i>
          <input
            disabled={isDisabled}
            type="text"
            placeholder="Buscar por producto..."
            value={searchTerm}
            onChange={handleSearchChange}
            id="search-producto"
          />
        </div>
        <select
          id="select-categoria"
          disabled={isDisabled}
          onChange={handleCategoriaChange}
        >
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

        <select
          name="marca"
          value={selectedMarca}
          onChange={handleMarcaChange}
          className="auto-search__input"
        >
          {" "}
          <option value="" disabled>
            {" "}
            Buscar por marca del vehículo{" "}
          </option>{" "}
          <option value="">Todas</option>
          {marcas.map((marca) => (
            <option key={marca} value={marca}>
              {" "}
              {marca}{" "}
            </option>
          ))}{" "}
        </select>

        <select
          name="modelo"
          value={selectedModelo}
          onChange={handleModeloChange}
          className="auto-search__input"
          required
        >
          <option value="" disabled>
            Buscar por modelo
          </option>{" "}
          <option value="">Todos</option>
          {selectedMarca &&
            (selectedMarca === "Todos los productos"
              ? Object.keys(modelos).flatMap((marca) =>
                  modelos[marca].map((modelo) => (
                    <option key={modelo} value={modelo}>
                      {" "}
                      {modelo}{" "}
                    </option>
                  ))
                )
              : modelos[selectedMarca].map((modelo) => (
                  <option key={modelo} value={modelo}>
                    {" "}
                    {modelo}{" "}
                  </option>
                )))}
        </select>
        <div>
          <button onClick={handleMinStock}>Menor stock</button>
          <button onClick={handleMaxStock}>Mayor stock</button>
        </div>
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
                <th>Stock</th>
                <th>Cantidad Mínima</th> {/* Nueva columna */}
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
                  <td>{row.cantidad_minima}</td> {/* Nueva celda */}
                  <td>
                    <button
                      className="button button-modificar"
                      disabled={isDisabled}
                      onClick={() => handleEdit(row.id_producto)}
                    >
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        style={{ color: "#ffffff" }}
                      />
                    </button>
                    <button
                      className="button button-eliminar"
                      disabled={isDisabled}
                      onClick={() => handleDelete(row.id_producto)}
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        style={{ color: "#ffffff" }}
                      />
                    </button>
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
