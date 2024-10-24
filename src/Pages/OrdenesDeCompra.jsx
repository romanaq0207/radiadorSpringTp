import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrdenesDeCompra.css';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../assets/config';

const OrdenesDeCompra = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [filter, setFilter] = useState('Todos');
    const [showDetailsPopup, setShowDetailsPopup] = useState(false);  // Estado para popup de detalles
    const [showReceptionPopup, setShowReceptionPopup] = useState(false); // Estado para popup de recepción
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [productReception, setProductReception] = useState([]); // Estado para controlar la recepción de productos
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

    // Mostrar popup de detalles
    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowDetailsPopup(true);
    };

    // Cerrar popup de detalles
    const closeDetailsPopup = () => {
        setShowDetailsPopup(false);
        setSelectedOrder(null);
    };

    // Mostrar popup de recepción
    const handleCompleteOrder = (order) => {
        setSelectedOrder(order);
        setProductReception(order.productos.map(producto => ({
            ...producto,
            recibido: false,
            cantidadRecibida: producto.cantidad,
        })));
        setShowReceptionPopup(true); // Muestra el popup con los productos para confirmar recepción
    };

    // Cerrar popup de recepción
    const closeReceptionPopup = () => {
        setShowReceptionPopup(false);
        setSelectedOrder(null);
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            if (newStatus === 'aceptada') {
                await axios.put(`${API_BASE_URL}/ordenes_de_compra/${orderId}/aceptar`);
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

    const handleConfirmReception = () => {
        // Aquí podrías guardar la información de la recepción de productos si es necesario
        updateOrderStatus(selectedOrder.id_orden_de_compra, 'Completada');
        closeReceptionPopup();
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
                            <td data-label="Fecha">{order.fecha_creacion}</td>
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
                        <p><strong>Fecha:</strong> {selectedOrder.fecha_creacion}</p>
                        <p><strong>Total:</strong> ${selectedOrder.total}</p>
                        <h3>Productos</h3>
                        <ul>
                            {selectedOrder.productos && selectedOrder.productos.map((producto, index) => (
                                <li key={index}>{producto.nombre} - Cantidad: {producto.cantidad}</li>
                            ))}
                        </ul>
                        <button className="popup-close-btn" onClick={closeDetailsPopup}>Cerrar</button>
                    </div>
                </div>
            )}
            {/* Popup para confirmar recepción de productos */}
            {showReceptionPopup && selectedOrder && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Confirmar recepción de productos</h2>
                        <p><strong>Proveedor:</strong> {selectedOrder.id_proveedor}</p>
                        <p><strong>Fecha:</strong> {selectedOrder.fecha_creacion}</p>
                        <h3>Productos recibidos</h3>
                        <ul>
                            {productReception.map((producto, index) => (
                                <li key={index}>
                                    <span>{producto.nombre} - Cantidad: {producto.cantidad}</span>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={producto.recibido}
                                            onChange={(e) => handleReceptionChange(index, 'recibido', e.target.checked)}
                                        /> Recibido completo
                                    </label>
                                    {!producto.recibido && (
                                        <select
                                            value={producto.cantidadRecibida}
                                            onChange={(e) => handleReceptionChange(index, 'cantidadRecibida', parseInt(e.target.value))}
                                        >
                                            {Array.from({ length: producto.cantidad + 1 }, (_, i) => (
                                                <option key={i} value={i}>{i}</option>
                                            ))}
                                        </select>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <button className="orders-btn confirm" onClick={handleConfirmReception}>Confirmar recepción</button>
                        <button className="popup-close-btn" onClick={closeReceptionPopup}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdenesDeCompra;
