import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { API_BASE_URL } from "../assets/config";
import "./ViewFormsSupervisor.css";

const ViewFormsOperador = () => {
  const navigate = useNavigate();
  const [formStates, setFormStates] = useState([]);
  const [formData, setFormData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/informes/obtener-informes-taller`);
        const informesConProductos = await Promise.all(
          response.data.map(async (informe) => {
            const productos = await fetchProductos(informe.id_informe);
            return { ...informe, productosUtilizados: productos };
          })
        );
        setFormData(informesConProductos);
        setFormStates(informesConProductos.map(() => ({ aprobado: null })));
      } catch (error) {
        console.error("Error al obtener los formularios:", error);
        setFormData([]);
        setFormStates([]);
      }
    };
    fetchForms();
  }, []);

  const handleConfirm = async (index) => {
    Swal.fire({
        title: "¿Estás seguro de que quieres confirmar?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, confirmar",
        cancelButtonText: "Cancelar",
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const informeId = formData[index].id_informe;

                console.log("OBTENIENDO PRODUCTOS DEL INFORME...");
                await new Promise(resolve => setTimeout(resolve, 10000)); 

                const productosResponse = await axios.get(
                    `${API_BASE_URL}/informes/obtener-productos-informe/${informeId}`
                );
                const productos = productosResponse.data;

                // 2. Restar la cantidad de cada producto en la base de datos
                for (const producto of productos) {
                    const { nombre, cantidad_utilizada } = producto;
                    try {
                        console.log(`RESTANDO CANTIDAD DEL PRODUCTO ${nombre}...`); 
                        await new Promise(resolve => setTimeout(resolve, 10000)); 

                        await axios.put(
                            `${API_BASE_URL}/productos/${nombre}/restar-cantidad-nombre`,
                            { cantidad: cantidad_utilizada }
                        );
                    } catch (error) {
                        console.error(
                            `Error al restar cantidad del producto ${nombre}:`,
                            error
                        );
                    }
                }

                console.log("VOLVIENDO A OBTENER PRODUCTOS DEL INFORME CON CANTIDADES ACTUALIZADAS...");
                await new Promise(resolve => setTimeout(resolve, 10000)); 

                // Volver a obtener los productos del informe con las cantidades actualizadas
                const productosActualizadosResponse = await axios.get(
                    `${API_BASE_URL}/informes/obtener-productos-informe/${informeId}`
                );
                const productosActualizados = productosActualizadosResponse.data;


                console.log(`ACTUALIZANDO ESTADO DEL INFORME ${informeId}...`); 
                await new Promise(resolve => setTimeout(resolve, 10000)); 

                // 3. Actualizar el estado del informe en la base de datos
                await axios.put(
                    `${API_BASE_URL}/informes/${informeId}/confirmar`
                );

                const newFormStates = [...formStates];
                newFormStates[index].aprobado = true;
                setFormStates(newFormStates);

                // 4. Generar órdenes de compra para cada producto
                for (const producto of productosActualizados) { // Usar productosActualizados aquí
                    await generarOrdenDeCompra(producto);
                }

                Swal.fire({
                    title: "Formulario confirmado",
                    text: "El formulario ha sido confirmado exitosamente.",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                }).then(() => {
                    navigate("/formularios-supervisor");
                });
            } catch (error) {
                console.error("Error al confirmar el formulario:", error);
                Swal.fire({
                    title: "Error",
                    text: "Hubo un error al confirmar el formulario.",
                    icon: "error",
                    confirmButtonText: "Aceptar",
                });
            }
        }
    });
};

const generarOrdenDeCompra = async (producto) => {
  try {
      const { cantidad, cantidad_minima, ...restoDelProducto } = producto;

      if (cantidad < cantidad_minima) { 
          // Renombrar proveedor_id a id_proveedor y agregar id_producto y cantidad_minima
          const productoConIdProveedor = {
              ...restoDelProducto,
              id_proveedor: producto.proveedor_id,
              id_producto: producto.id_producto,  
              cantidad_minima: producto.cantidad_minima 
          };
          delete productoConIdProveedor.proveedor_id; 

          console.log("Datos del producto enviados al endpoint:", productoConIdProveedor); 

          const response = await axios.post(`${API_BASE_URL}/ordenes-de-compra/generar-orden`, productoConIdProveedor); 

          if (response.status === 201) {  
              console.log(`Orden de compra generada correctamente para ${producto.nombre}`);
          } else {
              console.error(`Error al generar la orden de compra para ${producto.nombre}:`, response.data);
          }
      } else {
          console.log(`No se necesita generar orden de compra para ${producto.nombre}`);
      }
  } catch (error) {
      console.error(`Error al generar la orden de compra para ${producto.nombre}:`, error);
  }
};
  const handleDeny = async (index) => {
    Swal.fire({
      title: "¿Estás seguro de que quieres rechazar este formulario?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, rechazar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { value: motivo } = await Swal.fire({
          title: "Motivo de la denegación",
          input: "text",
          inputPlaceholder: "Ingrese el motivo de la denegación",
          showCancelButton: true,
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar",
          inputValidator: (value) => {
            if (!value) {
              return "Por favor, ingrese un motivo";
            }
          },
        });

        if (motivo) {
          try {
            await axios.put(
              `${API_BASE_URL}/informes/${formData[index].id_informe}/denegar`,
              { motivo }
            );

            const newFormStates = [...formStates];
            newFormStates[index].aprobado = false;
            setFormStates(newFormStates);

            Swal.fire({
              title: "Formulario denegado",
              text: "El formulario ha sido denegado.",
              icon: "error",
              confirmButtonText: "Aceptar",
            }).then(() => {
              navigate("/verificar-formularios");
            });
          } catch (error) {
            console.error("Error al denegar el formulario:", error);
            Swal.fire({
              title: "Error",
              text: "Hubo un error al denegar el formulario.",
              icon: "error",
              confirmButtonText: "Aceptar",
            });
          }
        }
      }
    });
  };

  const fetchProductos = async (idInforme) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/informes/obtener-productos-informe/${idInforme}`
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener los productos del informe:", error);
      return [];
    }
  };

  const openProductPopup = (products) => {
    setSelectedProducts(products);
    setShowPopup(true);
  };

  const closeProductPopup = () => {
    setShowPopup(false);
    setSelectedProducts([]);
  };

  return (
    <div className="container">
      <h2 className="title">Revisión de formularios</h2>
      {formData.map((form, index) => (
        <div key={index} className="card">
          <h3>Informe {form.id_informe}</h3> 
          <p>
            <strong>Mecanico:</strong> 
          </p>
          <p>
            <strong>Patente:</strong>{" "}
            
          </p>
          <p>
            <strong>Descripción:</strong> {form.descripcion}
          </p>

          <button onClick={() => openProductPopup(form.productosUtilizados)}>
            Ver productos utilizados
          </button>

          <div className="buttonContainer">
            <button
              onClick={() => handleConfirm(index)}
              disabled={formStates[index].aprobado !== null}
            >
              Confirmar
            </button>
            <button
              onClick={() => handleDeny(index)}
              disabled={formStates[index].aprobado !== null}
            >
              Denegar
            </button>
          </div>
        </div>
      ))}

      {showPopup && (
        <div className="popupOverlay">
          <div className="popupContent">
            <h3>Productos utilizados</h3>
            <table className="productosTable">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((producto, index) => (
                  <tr key={index}>
                    <td>{producto.nombre}</td>
                    <td>{producto.marca}</td>
                    <td>{producto.modelo}</td>
                    <td>{producto.cantidad_utilizada}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={closeProductPopup}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewFormsOperador;
