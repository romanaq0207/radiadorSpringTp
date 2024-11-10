import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../assets/config";
import { IoIosSend } from "react-icons/io";
import "./FormularioAccidenteMechanic.css";

const FormularioAccidenteMechanic = () => {
  const navigate = useNavigate();
  const [descripcion, setDescripcion] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [error, setError] = useState("");
  const [productos, setProductos] = useState([]);
  const [productosUtilizados, setProductosUtilizados] = useState([
    { producto: "", cantidad: "" },
  ]);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/productos`);
        setProductos(response.data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
        setProductos([]);
      }
    };
    fetchProductos();
  }, []);

  const handleProductoChange = (index, e) => {
    const newProductos = [...productosUtilizados];
    newProductos[index].producto = parseInt(e.target.value, 10);
    setProductosUtilizados(newProductos);
  };

  const handleCantidadChange = (index, cantidad) => {
    const newProductos = [...productosUtilizados];
    newProductos[index].cantidad = parseInt(cantidad, 10);
    setProductosUtilizados(newProductos);

    const newErrors = [...errors];
    newErrors[index] = cantidad < 0 ? " No puede ser negativo" : "";
    setErrors(newErrors);
  };

  const agregarFilaProducto = () => {
    setProductosUtilizados([
      ...productosUtilizados,
      { producto: "", cantidad: "" },
    ]);
    setErrors([...errors, ""]);
  };

  const eliminarProducto = (index) => {
    const newProductos = productosUtilizados.filter((_, i) => i !== index);
    const newErrors = errors.filter((_, i) => i !== index);
    setProductosUtilizados(newProductos);
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!descripcion) {
      setError("La descripción no puede estar vacía.");
      return;
    }

    if (productosUtilizados.some((item) => !item.producto || item.cantidad <= 0)) {
      setError("Debes seleccionar al menos un producto con una cantidad válida.");
      return;
    }

    if (!ubicacion) {
      setError("Debes seleccionar una ubicación (taller o misma ubicación).");
      return;
    }

    // Validación de stock disponible
    const productosConExceso = productosUtilizados.filter((item) => {
      const producto = productos.find((p) => p.id_producto === item.producto);
      return producto && item.cantidad > producto.cantidad;
    });

    if (productosConExceso.length > 0) {
      const mensajeExceso = productosConExceso
        .map((item) => {
          const producto = productos.find((p) => p.id_producto === item.producto);
          return `${producto.nombre} - Stock disponible: ${producto.cantidad}, solicitado: ${item.cantidad}`;
        })
        .join("\n");

      Swal.fire({
        icon: "error",
        title: "Cantidad excedida",
        text: `La cantidad solicitada excede el stock disponible:\n\n${mensajeExceso}`,
      });
      return;
    }

    setError("");

    if (window.confirm("¿Estás seguro de que quieres finalizar con el formulario?")) {
      try {
        const informeData = {
          descripcion,
          taller: ubicacion === "taller",
          mismaUbicacion: ubicacion === "misma_ubicacion",
        };
        const informeResponse = await axios.post(
          `${API_BASE_URL}/informes/crear-informe`,
          informeData
        );
        const informeId = informeResponse.data.id_informe;

        for (const producto of productosUtilizados) {
          const productoData = {
            id_producto: producto.producto,
            cantidad: producto.cantidad,
          };
          await axios.post(
            `${API_BASE_URL}/informes/${informeId}/agregar-producto`,
            productoData
          );
        }
        navigate("/busqueda-auto-mecanico");
      } catch (error) {
        console.error("Error al guardar el informe:", error);
        setError("Hubo un error al guardar el informe.");
      }
    }
  };

  return (
    <form className="formulario-accidente" onSubmit={handleSubmit}>
      <label>Descripción del problema:</label>
      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        rows="4"
        required
      />

      {error && <div className="error-alert">{error}</div>}

      <h2>Productos utilizados</h2>
      <table className="productos-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {productosUtilizados.map((item, index) => (
            <tr key={index}>
              <td>
                <select
                  value={item.producto}
                  onChange={(e) => handleProductoChange(index, e)}
                >
                  <option value="">Seleccionar producto</option>
                  {productos.map((producto) => (
                    <option key={producto.id_producto} value={producto.id_producto}>
                      {producto.nombre} - {producto.marca} - {producto.modelo} - 
                      Stock: {producto.cantidad}
                    </option>
                  ))}
                </select>
                {errors[index] && !item.producto && (
                  <div className="error-message">
                    <FontAwesomeIcon icon={faExclamationCircle} />
                    <span>{errors[index]}</span>
                  </div>
                )}
              </td>
              <td>
                <input
                  type="number"
                  value={item.cantidad}
                  onChange={(e) => handleCantidadChange(index, e.target.value)}
                  placeholder="Cantidad"
                />
                {errors[index] && item.cantidad < 0 && (
                  <div className="error-message">
                    <FontAwesomeIcon icon={faExclamationCircle} />
                    <span>{errors[index]}</span>
                  </div>
                )}
              </td>
              <td>
                <button
                  type="button"
                  onClick={() => eliminarProducto(index)}
                  className="delete-button"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" className="add-product-btn" onClick={agregarFilaProducto}>
        +
      </button>

      <div className="ubicacion-opciones">
        <label>
          <input
            type="radio"
            name="ubicacion"
            value="taller"
            checked={ubicacion === "taller"}
            onChange={() => setUbicacion("taller")}
          />
          Taller
        </label>
        <label>
          <input
            type="radio"
            name="ubicacion"
            value="misma_ubicacion"
            checked={ubicacion === "misma_ubicacion"}
            onChange={() => setUbicacion("misma_ubicacion")}
          />
          Misma Ubicación
        </label>
      </div>

      <button type="submit"><IoIosSend /></button>
    </form>
  );
};

export default FormularioAccidenteMechanic;
