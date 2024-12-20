import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrdenesDeCompra.css';

import { faCheck, faBan } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo} from '@fortawesome/free-solid-svg-icons';
import { API_BASE_URL } from '../assets/config';
import Swal from 'sweetalert2';

const OrdenesDeCompra = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [showDetailsPopup, setShowDetailsPopup] = useState(false);
    const [showReceptionPopup, setShowReceptionPopup] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [productReception, setProductReception] = useState([]);
    const navigate = useNavigate();
    const [filterState, setFilterState] = useState('Todos');
    const [filterProveedor, setFilterProveedor] = useState('');
    const [filterOrderNumber, setFilterOrderNumber] = useState('');
    const [filterDate, setFilterDate] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/ordenes_de_compra`);
                console.log(response.data);
                setOrders(response.data);
                setFilteredOrders(response.data);
            } catch (error) {
                console.error('Error al obtener órdenes de compra:', error);
                alert('Error al obtener órdenes de compra.');
            }
        };
        fetchOrders();
    }, []);

    useEffect(() => {
        // Filtra las órdenes según los valores actuales de los filtros
        const filtered = orders.filter(order => {
            const matchState = filterState === 'Todos' || order.estado === filterState;
            const matchProveedor = filterProveedor === '' || order.id_proveedor.toString().toLowerCase().includes(filterProveedor.toLowerCase());
            const matchOrderNumber = filterOrderNumber === '' || order.id_orden_de_compra.toString().includes(filterOrderNumber);
            const matchDate = filterDate === '' || new Date(order.fecha_creacion).toISOString().split('T')[0] === filterDate;
    
            return matchState && matchProveedor && matchOrderNumber && matchDate;
        });
        setFilteredOrders(filtered);
    }, [orders, filterState, filterProveedor, filterOrderNumber, filterDate]);


    const handleStateFilterChange = (e) => setFilterState(e.target.value);
    const handleProveedorFilterChange = (e) => setFilterProveedor(e.target.value);
    const handleOrderNumberFilterChange = (e) => setFilterOrderNumber(e.target.value);
    const handleDateFilterChange = (e) => setFilterDate(e.target.value);

    const fetchReceptionDetails = async (orderId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/ordenes_de_compra/${orderId}/recepcion_productos`);
            return response.data;
           
        } catch (error) {
            console.error('Error al obtener detalles de recepción de productos:', error);
            alert('Error al obtener detalles de recepción de productos.');
            return [];
        }
    };
    

    const handleViewDetails = async (order) => {
        console.log('Ver detalles de la orden:', order); // Verifica que se esté llamando correctamente
        setSelectedOrder(order);
        
        // Si la orden está completada, obtener detalles de recepción
        if (order.estado === 'completada') {
            const receptionDetails = await fetchReceptionDetails(order.id_orden_de_compra);
            const receptionMap = {};
    
            // Asegúrate de que receptionDetails.productos es un array plano
            receptionDetails.productos.forEach(productoArray => {
                productoArray.forEach(producto => {
                    receptionMap[producto.id_producto] = producto.cantidad_recibida; // Mapear cantidad recibida por ID de producto
                });
            });
    
            setProductReception(order.productos.map(producto => ({
                ...producto,
                cantidadRecibida: receptionMap[producto.id_producto] || 0, // Usar cantidad recibida o 0 si no hay recepción
            })));
        } else {
            setProductReception(order.productos.map(producto => ({
                ...producto,
                recibido: false,
                cantidadRecibida: 0,
                precioActualizado: producto.precio,
            })));
        }
        
        setShowDetailsPopup(true);
    };
    
    

    const closeDetailsPopup = () => {
        setShowDetailsPopup(false);
        setSelectedOrder(null);
    };

    const handleCompleteOrder = (order) => {
        setSelectedOrder(order);
        setProductReception(order.productos.map(producto => ({
            ...producto,
            recibido: false,
            cantidadRecibida: producto.cantidad,
            precioActualizado: producto.precio,
        })));
        setShowReceptionPopup(true);
    };

    const closeReceptionPopup = () => {
        setShowReceptionPopup(false);
        setSelectedOrder(null);
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        const statusMessages = {
            aceptada: 'Aceptar',
            inactiva: 'Inactivar',
            rechazada: 'Rechazar'
        };
    
        Swal.fire({
            title: `¿Estás seguro de que quieres ${statusMessages[newStatus]} esta orden?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    if (newStatus === 'aceptada') {
                        await axios.put(`${API_BASE_URL}/ordenes_de_compra/${orderId}/aceptar`);
                    } else if (newStatus === 'inactiva') {
                        await axios.put(`${API_BASE_URL}/ordenes_de_compra/${orderId}/inactivar`);
                    } else if (newStatus === 'rechazada') {
                        await axios.put(`${API_BASE_URL}/ordenes_de_compra/${orderId}/rechazar`);
                    }
    
                    const updatedOrders = orders.map(order => 
                        order.id_orden_de_compra === orderId ? { ...order, estado: newStatus } : order
                    );
                    setOrders(updatedOrders);
                    setFilteredOrders(updatedOrders.filter(order => order.estado === filterState || filterState === 'Todos'));
    
                    Swal.fire('Estado actualizado', 'La orden ha sido actualizada con éxito.', 'success');
                } catch (error) {
                    console.error('Error al actualizar el estado de la orden de compra:', error);
                    Swal.fire('Error', 'Hubo un problema al actualizar la orden.', 'error');
                }
            }
        });
    };

    const handleReceptionChange = (index, field, value) => {
        const updatedProductReception = [...productReception];
        
        if (field === 'precioActualizado') {
          updatedProductReception[index].precioActualizado = value;
        } else {
          updatedProductReception[index][field] = value;
        }
      
        setProductReception(updatedProductReception);
      };
      

      const handleConfirmReception = async () => {
        try {
            const productosRecibidos = productReception.map(producto => ({
                id_producto: producto.id_producto,
                cantidadRecibida: producto.recibido ? producto.cantidad : producto.cantidadRecibida,
                precio: producto.precioActualizado || producto.precio, // Usar el precio actualizado o el precio anterior
            }));
    
            console.log('Productos recibidos:', productosRecibidos);
    
        
            await axios.post(`${API_BASE_URL}/ordenes_de_compra/${selectedOrder.id_orden_de_compra}/confirmar_recepcion`, {
                productos: productosRecibidos
            });
    
           
            await Promise.all(productReception.map(async (producto) => {
                    await axios.put(`${API_BASE_URL}/productos/${producto.id_producto}/actualizar_precio`, {
                        precio: parseFloat(producto.precioActualizado) 
                    });
                
            }));
    
       
            updateOrderStatus(selectedOrder.id_orden_de_compra, 'completada');
    
            closeReceptionPopup();
            Swal.fire('Recepción de productos confirmada.', '', 'success');
        } catch (error) {
            console.error('Error al confirmar la recepción de productos:', error);
            alert('Error al confirmar la recepción de productos.');
        }
    };

    const calcularTotal = (productos) => 
        productos.reduce((acumulado, producto) => 
          acumulado + (parseFloat(producto.precio) || 0) * (parseInt(producto.cantidad, 10) || 0), 0);
      

    const renderActions = (estado, order) => {
        switch (estado) {
            case 'creada':
                return (
                    <>
                        <button className="orders-btn view" onClick={() => handleViewDetails(order)}><FontAwesomeIcon icon={faCircleInfo} style={{color: "#ffffff",}} /></button>
                        <button className="orders-btn accept" onClick={async () => await updateOrderStatus(order.id_orden_de_compra, 'aceptada')}><FontAwesomeIcon icon={faCheck} style={{ color: "#ffffff" }} /></button>
                        <button className="orders-btn reject" onClick={() => updateOrderStatus(order.id_orden_de_compra, 'rechazada')}><FontAwesomeIcon icon={faBan} style={{ color: "#ffffff" }} /></button>
                    </>
                );
            case 'aceptada':
                return (
                    <>
                        <button className="orders-btn view" onClick={() => handleViewDetails(order)}><FontAwesomeIcon icon={faCircleInfo} style={{color: "#ffffff",}} /></button>
                        <button className="orders-btn complete" onClick={() => handleCompleteOrder(order)}><FontAwesomeIcon icon={faCheck} style={{ color: "#ffffff" }} /></button>
                        <button className="orders-btn inactivate" onClick={() => updateOrderStatus(order.id_orden_de_compra, 'inactiva')}><FontAwesomeIcon icon={faBan} style={{ color: "#ffffff" }} /></button>
                    </>
                );
                case 'automática':
                    return (
                        <>
                            <button className="orders-btn view" onClick={() => handleViewDetails(order)}><FontAwesomeIcon icon={faCircleInfo} style={{color: "#ffffff",}} /></button>
                            <button className="orders-btn accept" onClick={async () => await updateOrderStatus(order.id_orden_de_compra, 'aceptada')}><FontAwesomeIcon icon={faCheck} style={{ color: "#ffffff" }} /></button>
                            <button className="orders-btn reject" onClick={() => updateOrderStatus(order.id_orden_de_compra, 'rechazada')}><FontAwesomeIcon icon={faBan} style={{ color: "#ffffff" }} /></button>
                        </>
                    );
            case 'completada':

            case 'rechazada':

            case 'inactiva':
                return <button className="orders-btn view" onClick={() => handleViewDetails(order)}><FontAwesomeIcon icon={faCircleInfo} style={{color: "#ffffff",}} /></button>;
            default:
                return null;
        }
    };

    return (
        <div className="orders-container">
            <div className="orders-header">
                <h1>Órdenes de compra</h1>
                <button className="orders-btn add-order" onClick={() => navigate('/add-orden-gerente')}>+</button>
            </div>
            <div className="orders-filter">
                <select value={filterState} onChange={handleStateFilterChange}>
                    <option value="Todos">Filtra por Estado</option>
                    <option value="creada">Creada</option>
                    <option value="aceptada">Aceptada</option>
                    <option value="completada">Completada</option>
                    <option value="rechazada">Rechazada</option>
                  { /* <option value="inactiva">Inactiva</option>*/}
                </select>
        
                <input 
                    type="text" 
                    value={filterProveedor} 
                    onChange={handleProveedorFilterChange} 
                    placeholder="Buscar por proveedor" 
                />

            
                <input 
                    type="text" 
                    value={filterOrderNumber} 
                    onChange={handleOrderNumberFilterChange} 
                    placeholder="Buscar por número de orden" 
                />

               
                <input 
                    type="date" 
                    value={filterDate} 
                    onChange={handleDateFilterChange} 
                />
            </div>
            <table className="orders-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Número de Orden</th> {/* Nueva columna */}
                        <th>Proveedor</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Total</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((order, index) => ( 
                        <tr key={index}>
                            <td data-label="ID">{order.id_orden_de_compra}</td>
                            <td data-label="Número de Orden">{order.numero_orden}</td> {/* Mostrar el número de orden */}
                            <td data-label="Proveedor">{order.nombre_proveedor}</td>
                            <td data-label="Fecha">{new Date(order.fecha_creacion).toLocaleDateString()}</td>
                            <td data-label="Estado"><span className={`orders-status ${order.estado.toLowerCase()}`}>{order.estado}</span></td>
                            <td data-label="Total">${calcularTotal(order.productos)}</td>
                            <td data-label="Acciones">{renderActions(order.estado, order)}</td>
                        </tr>
                        
                    ))}
                </tbody>
            </table>
            {/* Popup para ver detalles */}
{showDetailsPopup && selectedOrder && (
    <div className="popup-overlay-details">
        <div className="popup-content">
            <h2>Detalles de la orden</h2>
            <p><strong>Proveedor:</strong> {selectedOrder.id_proveedor}</p>
            <p><strong>Fecha:</strong> {new Date(selectedOrder.fecha_creacion).toLocaleDateString()}</p>
            <h3>Productos</h3>
            <table>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad Solicitada</th>
                        <th>Cantidad Recibida</th>
                        <th>Precio por Unidad</th>
                    </tr>
                </thead>
                <tbody>
                    {productReception.map((producto, index) => (
                        <tr key={index}>
                            <td>{producto.nombre}</td>
                            <td>{producto.cantidad}</td>
                            <td>{producto.cantidadRecibida}</td>
                            <td>{producto.precio}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="popup-btn" onClick={closeDetailsPopup}>X</button>
        </div>
    </div>
)}


            {/* Popup para confirmar recepción */}
            {showReceptionPopup && selectedOrder && (
    <div className="popup-overlay-confirm">
        <div className="popup-content">
            <h2>Confirmar Recepción de Productos</h2>
            <h3>Productos de la Orden</h3>
            <table>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad Solicitada</th>
                        <th>Cantidad Recibida</th>
                        <th>Precio Unitario Anterior</th>
                        <th>Precio Unitario Actualizado</th>
                    </tr>
                </thead>
                <tbody>
                    {productReception.map((producto, index) => (
                        <tr key={index}>
                            <td>{producto.nombre}</td>
                            <td>{producto.cantidad}</td>
                            <td>
                                <input 
                                    type="number" 
                                    value={producto.cantidadRecibida} 
                                    onChange={(e) => handleReceptionChange(index, 'cantidadRecibida', e.target.value)} 
                                    min="0" 
                                />
                            </td>
                            <td>{producto.precio}</td>
                            <td>
                                <input 
                                    type="number" 
                                    value={producto.precioActualizado || producto.precio} 
                                    onChange={(e) => handleReceptionChange(index, 'precioActualizado', e.target.value)} 
                                    min="0" 
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="popup-btn confirm" onClick={handleConfirmReception}>Confirmar Recepción</button>
            <button className="popup-btn" onClick={closeReceptionPopup}>Cerrar</button>
            </div>
                </div>
            )}
        </div>
    );
};

export default OrdenesDeCompra;
