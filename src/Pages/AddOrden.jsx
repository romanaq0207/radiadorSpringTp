import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios'; // Importar axios
import proveedoresData from '../data/proveedores.json';
import productosData from '../data/productos.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import './AddOrden.css';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../assets/config';



const AddOrden = () => {
    const [proveedores, setProveedores] = useState([]);
    const [productos, setProductos] = useState([]);
    const [selectedProveedor, setSelectedProveedor] = useState('');
    const [ordenProductos, setOrdenProductos] = useState([{ producto: '', cantidad: '' }]);
    const [errors, setErrors] = useState([]); // Estado para almacenar mensajes de error
    const navigate = useNavigate();

    useEffect(() => {
        setProveedores(proveedoresData);
        setProductos(productosData);
    }, []);

    const handleProveedorChange = (e) => {
        setSelectedProveedor(e.target.value);
    };

    const handleProductoChange = (index, e) => {
        const newProductos = [...ordenProductos];
        newProductos[index].producto = e.target.value;
        setOrdenProductos(newProductos);
    };

    const handleCantidadChange = (index, cantidad) => {
        const newProductos = [...ordenProductos];
        newProductos[index].cantidad = cantidad;
        setOrdenProductos(newProductos);

        const newErrors = [...errors];
        newErrors[index] = cantidad < 0 ? " No puede ser negativo" : "";
        setErrors(newErrors);
    };

    const agregarFilaProducto = () => {
        setOrdenProductos([...ordenProductos, { producto: '', cantidad: '' }]);
        setErrors([...errors, ""]);
    };

    const handleAgregarOrden = async () => {
        // Validar que se haya seleccionado un proveedor
        if (!selectedProveedor) {
            Swal.fire({
                title: 'Error',
                text: 'Debe seleccionar un proveedor.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Validar que todos los productos y cantidades sean válidos
        const hasErrors = ordenProductos.some((item, index) => {
            if (!item.producto) {
                const newErrors = [...errors];
                newErrors[index] = " Debe seleccionar un producto";
                setErrors(newErrors);
                return true;
            }
            return item.cantidad < 0;
        });

        if (hasErrors) {
            Swal.fire({
                title: 'Error',
                text: 'Existen errores en los productos seleccionados. Corrija antes de continuar.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Preparar datos de la orden
        const ordenData = {
            proveedor: selectedProveedor,
            productos: ordenProductos
        };

        try {
            // Enviar la orden a la base de datos
            const response = await axios.post(`${API_BASE_URL}/ordenes_de_compra`, ordenData);
            
            if (response.status === 201) { // Verificar si se creó correctamente
                Swal.fire({
                    title: 'Orden agregada',
                    text: 'La nueva orden de compra ha sido agregada exitosamente',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    navigate('/orden-de-compra'); // Redirige a "/orden-de-compra" después de confirmar
                });
            }
        } catch (error) {
            console.error('Error al agregar la orden:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo agregar la orden de compra. Intente nuevamente.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            navigate('/orden-de-compra'); 
        }
    };

    return (
        <div className="agregar-orden-container">
            <div className="agregar-orden-header">
                <h1>Agregar Nueva Orden de Compra</h1>
                <button className="add-order-btn" onClick={handleAgregarOrden}>
                    <FontAwesomeIcon icon={faCheck} style={{ color: "#ffffff" }} />
                </button>
            </div>
            
            <div className="form-group">
                <select value={selectedProveedor} onChange={handleProveedorChange}>
                    <option value="">Seleccionar proveedor</option>
                    {proveedores.map((proveedor, index) => (
                        <option key={index} value={proveedor.id}>{proveedor.nombre}</option>
                    ))}
                </select>
            </div>

            <h2>Productos</h2>
            <table className="productos-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                    {ordenProductos.map((item, index) => (
                        <tr key={index}>
                            <td>
                                <select
                                    value={item.producto}
                                    onChange={(e) => handleProductoChange(index, e)}
                                >
                                    <option value="">Seleccionar producto</option>
                                    {productos.map((producto, prodIndex) => (
                                        <option key={prodIndex} value={producto.id}>{producto.nombre}</option>
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
                                <div style={{ position: 'relative' }}>
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
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Botón para agregar una fila de producto */}
            <button className="add-product-btn" onClick={agregarFilaProducto}>
                +
            </button>
        </div>
    );
};

export default AddOrden;
