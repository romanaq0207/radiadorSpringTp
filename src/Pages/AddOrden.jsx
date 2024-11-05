import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import './AddOrden.css';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../assets/config';

const AddOrden = () => {
    const [proveedores, setProveedores] = useState([]);
    const [proveedoresMap, setProveedoresMap] = useState({});
    const [productos, setProductos] = useState([]);
    const [selectedProveedor, setSelectedProveedor] = useState('');
    const [ordenProductos, setOrdenProductos] = useState([{ producto: '', cantidad: '' }]);
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        // Cargar proveedores activos
        const fetchProveedores = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/proveedores/activos`);
                const proveedoresActivos = response.data.filter(proveedor => proveedor.activo);
                setProveedores(proveedoresActivos);
    
                // Crear el objeto de mapeo
                const map = {};
                proveedoresActivos.forEach(proveedor => {
                    map[proveedor.nombre] = proveedor.id_proveedor; // Asegúrate de usar 'id_proveedor' si es el nombre correcto
                });
                console.log('Mapa de proveedores:', map); // Agregar log para verificar el objeto de mapeo
                setProveedoresMap(map);
    
            } catch (error) {
                console.error('Error al cargar proveedores:', error);
            }
        };
    
        fetchProveedores();
    }, []);
    
    

    const fetchProductosPorProveedor = async (proveedorId) => {
        try {
            console.log('Obteniendo productos para el proveedor ID:', proveedorId); // Log para verificar el proveedorId
            const response = await axios.get(`${API_BASE_URL}/productos/productos-por-proovedor/${proveedorId}`);
            console.log('Productos recibidos:', response.data); // Log para verificar los datos recibidos
            setProductos(response.data); // Actualiza los productos mostrados según el proveedor seleccionado
        } catch (error) {
            console.error('Error al obtener productos del proveedor:', error);
            setProductos([]); // Limpiar productos si ocurre un error
        }
    };
    
    const handleProveedorChange = (e) => {
        const proveedorNombre = e.target.value;
        console.log('Nombre del proveedor seleccionado:', proveedorNombre); // Log para verificar el nombre seleccionado
        setSelectedProveedor(proveedorNombre);
    
        // Obtener el ID del proveedor del objeto de mapeo
        const proveedorId = proveedoresMap[proveedorNombre];
        console.log('ID del proveedor obtenido del mapeo:', proveedorId); // Log para verificar el proveedorId obtenido
    
        if (proveedorId) {
            fetchProductosPorProveedor(proveedorId); // Llama a la función para obtener productos del proveedor seleccionado
        } else {
            setProductos([]); // Limpiar productos si no hay proveedor seleccionado
        }
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
        // Validaciones y lógica de agregar la orden (sin cambios)
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
        {proveedores.map((proveedor) => (
            <option key={proveedor.id} value={proveedor.nombre}>{proveedor.nombre}</option> // Usa el nombre como valor
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
                                    {productos.map((producto) => (
                                        <option key={producto.id_producto} value={producto.id_producto}>
                                            {producto.nombre} - {producto.marca} - {producto.modelo} -  Cantidad :{producto.cantidad}
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
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="add-product-btn" onClick={agregarFilaProducto}>
                +
            </button>
        </div>
    );
};

export default AddOrden;
