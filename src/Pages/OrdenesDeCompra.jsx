import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrdenesDeCompra.css';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../assets/config';

const OrdenesDeCompra = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [filter, setFilter] = useState('Todos');
    const [showDetailsPopup, setShowDetailsPopup] = useState(false);
    const [showReceptionPopup, setShowReceptionPopup] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [productReception, setProductReception] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/ordenes_de_compra`);
                setOrders(response.data);
                setFilteredOrders(response.data);
            } catch (error) {
                console.error('Error al obtener órdenes de compra:', error);
                alert('Error al obtener órdenes de compra.');
            }
        };
        fetchOrders();
    }, []);

    const handleFilterChange = (e) => {
        const status = e.target.value;
        setFilter(status);
        if (status === 'Todos') {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter(order => order.estado === status));
        }
    };

    const fetchReceptionDetails = async (orderId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/ordenes_de_compra/${orderId}/recepcion_productos`);
            return response.data; // Devuelve los datos de recepción
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
                cantidadRecibida: producto.cantidad,
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
        })));
        setShowReceptionPopup(true);
    };

    const closeReceptionPopup = () => {
        setShowReceptionPopup(false);
        setSelectedOrder(null);
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            if (newStatus === 'aceptada') {
                await axios.put(`${API_BASE_URL}/ordenes_de_compra/${orderId}/aceptar`);
            } else if (newStatus === 'inactiva') {
                await axios.put(`${API_BASE_URL}/ordenes_de_compra/${orderId}/inactivar`);
            }

            const updatedOrders = orders.map(order => {
                if (order.id_orden_de_compra === orderId) {
                    return { ...order, estado: newStatus };
                }
                return order;
            });
            setOrders(updatedOrders);
            setFilteredOrders(updatedOrders.filter(order => order.estado === filter || filter === 'Todos'));
        } catch (error) {
            console.error('Error al actualizar el estado de la orden de compra:', error);
            alert('Error al actualizar el estado de la orden de compra.');
        }
    };

    const handleReceptionChange = (index, field, value) => {
        const updatedReception = [...productReception];
        updatedReception[index][field] = value;
        setProductReception(updatedReception);
    };

    const handleConfirmReception = async () => {
        try {
            const productosRecibidos = productReception.map(producto => ({
                id_producto: producto.id_producto,
                cantidadRecibida: producto.recibido ? producto.cantidad : producto.cantidadRecibida
            }));

            console.log('Productos recibidos:', productosRecibidos);

            await axios.post(`${API_BASE_URL}/ordenes_de_compra/${selectedOrder.id_orden_de_compra}/confirmar_recepcion`, {
                productos: productosRecibidos
            });

            updateOrderStatus(selectedOrder.id_orden_de_compra, 'completada');

            closeReceptionPopup();
            alert('Recepción de productos confirmada.');
        } catch (error) {
            console.error('Error al confirmar la recepción de productos:', error);
            alert('Error al confirmar la recepción de productos.');
        }
    };

    const renderActions = (estado, order) => {
        switch (estado) {
            case 'creada':
                return (
                    <>
                        <button className="orders-btn view" onClick={() => handleViewDetails(order)}>Ver detalles</button>
                        <button className="orders-btn accept" onClick={async () => await updateOrderStatus(order.id_orden_de_compra, 'aceptada')}>Aceptar</button>
                        <button className="orders-btn reject" onClick={() => updateOrderStatus(order.id_orden_de_compra, 'rechazada')}>Rechazar</button>
                    </>
                );
            case 'aceptada':
                return (
                    <>
                        <button className="orders-btn view" onClick={() => handleViewDetails(order)}>Ver detalles</button>
                        <button className="orders-btn complete" onClick={() => handleCompleteOrder(order)}>Completar</button>
                        <button className="orders-btn inactivate" onClick={() => updateOrderStatus(order.id_orden_de_compra, 'inactiva')}>Inactivar</button>
                    </>
                );
            case 'completada':
            case 'rechazada':
            case 'inactiva':
                return <button className="orders-btn view" onClick={() => handleViewDetails(order)}>Ver detalles</button>;
            default:
                return null;
        }
    };

    return (
        <div className="orders-container">
            <div className="orders-header">
                <h1>Órdenes de compra</h1>
                <button className="orders-btn add-order" onClick={() => navigate('/add-orden')}>Agregar Orden de Compra</button>
            </div>
            <div className="orders-filter">
                <label>Filtrar por estado:</label>
                <select value={filter} onChange={handleFilterChange}>
                    <option value="Todos">Todos</option>
                    <option value="creada">Creada</option>
                    <option value="aceptada">Aceptada</option>
                    <option value="completada">Completada</option>
                    <option value="rechazada">Rechazada</option>
                    <option value="inactiva">Inactiva</option>
                </select>
            </div>
            <table className="orders-table">
                <thead>
                    <tr>
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
                            <td data-label="Proveedor">{order.id_proveedor}</td>
                            <td data-label="Fecha">{new Date(order.fecha_creacion).toLocaleDateString()}</td>
                            <td data-label="Estado"><span className={`orders-status ${order.estado.toLowerCase()}`}>{order.estado}</span></td>
                            <td data-label="Total">${order.total}</td>
                            <td data-label="Acciones">{renderActions(order.estado, order)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Popup para ver detalles */}
{showDetailsPopup && selectedOrder && (
    <div className="popup-overlay">
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
                    </tr>
                </thead>
                <tbody>
                    {productReception.map((producto, index) => (
                        <tr key={index}>
                            <td>{producto.nombre}</td>
                            <td>{producto.cantidad}</td>
                            <td>{producto.cantidadRecibida}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="popup-btn" onClick={closeDetailsPopup}>Cerrar</button>
        </div>
    </div>
)}


            {/* Popup para confirmar recepción */}
            {showReceptionPopup && selectedOrder && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Confirmar Recepción de Productos</h2>
                        <h3>Productos de la Orden</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad Solicitada</th>
                                    <th>Cantidad Recibida</th>
                                    <th>Recibido</th>
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
                                        <td>
                                            <input 
                                                type="checkbox" 
                                                checked={producto.recibido} 
                                                onChange={(e) => handleReceptionChange(index, 'recibido', e.target.checked)} 
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
