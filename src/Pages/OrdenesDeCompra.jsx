import React, { useState, useEffect } from 'react';
import './OrdenesDeCompra.css'; 
import ordenesData from '../data/ordenes.json';
import { useNavigate } from 'react-router-dom';

const OrdenesDeCompra = () => {
    const [orders, setOrders] = useState([]); 
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [filter, setFilter] = useState('Todos');
    const [showPopup, setShowPopup] = useState(false); 
    const [selectedOrder, setSelectedOrder] = useState(null); 
    const navigate = useNavigate();

    useEffect(() => {
        setOrders(ordenesData);  
        setFilteredOrders(ordenesData);  
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

    const handleViewDetails = (order) => {
        setSelectedOrder(order); 
        setShowPopup(true); 
    };

    const closePopup = () => {
        setShowPopup(false); 
        setSelectedOrder(null); 
    };


    const updateOrderStatus = (orderId, newStatus) => {
        const updatedOrders = orders.map(order => {
            if (order.id === orderId) { 
                return { ...order, estado: newStatus };
            }
            return order;
        });
        setOrders(updatedOrders);
        setFilteredOrders(updatedOrders.filter(order => order.estado === filter || filter === 'Todos'));
    };

    const renderActions = (estado, order) => {
        switch (estado) {
            case 'Creada':
                return (
                    <>
                        <button className="orders-btn view" onClick={() => handleViewDetails(order)}>Ver detalles</button>
                        <button className="orders-btn accept" onClick={() => updateOrderStatus(order.id, 'Aprobada')}>Aceptar</button>
                        <button className="orders-btn reject" onClick={() => updateOrderStatus(order.id, 'Rechazada')}>Rechazar</button>
                    </>
                );
            case 'Aprobada':
                return (
                    <>
                        <button className="orders-btn view" onClick={() => handleViewDetails(order)}>Ver detalles</button>
                        <button className="orders-btn complete" onClick={() => updateOrderStatus(order.id, 'Completada')}>Completar orden</button>
                        <button className="orders-btn inactivate" onClick={() => updateOrderStatus(order.id, 'Inactiva')}>Inactivar</button>
                    </>
                );
            case 'Completada':
                return <button className="orders-btn view" onClick={() => handleViewDetails(order)}>Ver detalles</button>;
            case 'Rechazada':
                return <button className="orders-btn view" onClick={() => handleViewDetails(order)}>Ver detalles</button>;
            default:
                return null;
        }
    };
    const handleAddOrderClick = () => {
        navigate('/add-orden'); // Redirigimos a la página AddOrden
    };

    return (
        <div className="orders-container">
            <div className="orders-header">
                <h1>Órdenes de compra</h1>
                <button className="orders-btn add-order" onClick={handleAddOrderClick}>Agregar Orden de Compra</button>
            </div>

            <div className="orders-filter">
                <label>Filtrar por estado:</label>
                <select value={filter} onChange={handleFilterChange}>
                    <option value="Todos">Todos</option>
                    <option value="Creada">Creada</option>
                    <option value="Aprobada">Aprobada</option>
                    <option value="Completada">Completada</option>
                    <option value="Rechazada">Rechazada</option>
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
                            <td>{order.proveedor}</td>
                            <td>{order.fecha}</td>
                            <td><span className={`orders-status ${order.estado.toLowerCase()}`}>{order.estado}</span></td>
                            <td>${order.total}</td>
                            <td>{renderActions(order.estado, order)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

      
            {showPopup && selectedOrder && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Detalles de la orden</h2>
                        <p><strong>Proveedor:</strong> {selectedOrder.proveedor}</p>
                        <p><strong>Fecha:</strong> {selectedOrder.fecha}</p>
                        <p><strong>Total:</strong> ${selectedOrder.total}</p>

                  
                        <h3>Productos</h3>
                        <ul>
                            {selectedOrder.productos && selectedOrder.productos.map((producto, index) => (
                                <li key={index}>{producto.nombre} - Cantidad: {producto.cantidad}</li>
                            ))}
                        </ul>

                        <button className="popup-close-btn" onClick={closePopup}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdenesDeCompra;
