import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import proveedoresData from '../data/proveedores.json'; // Archivo JSON de proveedores
import productosData from '../data/productos.json'; // Archivo JSON de productos
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck} from '@fortawesome/free-solid-svg-icons';
import './AddOrden.css'; // Archivo CSS para los estilos
import { useNavigate } from 'react-router-dom'; // Importar useNavigate


const AddOrden = () => {
    const [proveedores, setProveedores] = useState([]);
    const [productos, setProductos] = useState([]);
    const [selectedProveedor, setSelectedProveedor] = useState('');
    const [ordenProductos, setOrdenProductos] = useState([{ producto: '', cantidad: '' }]);
    const navigate = useNavigate();

    useEffect(() => {
        setProveedores(proveedoresData); // Cargamos los proveedores desde el JSON
        setProductos(productosData); // Cargamos los productos desde el JSON
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
    };

    const agregarFilaProducto = () => {
        setOrdenProductos([...ordenProductos, { producto: '', cantidad: '' }]);
    };

    const handleAgregarOrden = () => {
        Swal.fire({
            title: 'Orden agregada',
            text: 'La nueva orden de compra ha sido agregada exitosamente',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            navigate('/orden-de-compra'); // Redirige a "/orden-de-compra" después de confirmar
        });
    };

    return (
        <div className="agregar-orden-container">
            <div className="agregar-orden-header">
            <h1>Agregar Nueva Orden de Compra</h1>

            <button className="add-order-btn" onClick={handleAgregarOrden}>
            <FontAwesomeIcon icon={faCheck} style={{color: "#ffffff",}} />
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
                            </td>
                            <td>
                                <input
                                    type="number"
                                    min="1"
                                    value={item.cantidad}
                                    onChange={(e) => handleCantidadChange(index, e.target.value)}
                                    className="swal2-input"
                                    placeholder="Cantidad"
                                />
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
