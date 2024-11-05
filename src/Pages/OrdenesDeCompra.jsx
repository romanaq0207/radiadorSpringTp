import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrdenesDeCompra.css';
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
    const [providers, setProviders] = useState({});

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

    useEffect(() => {
        const fetchProviders = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/proveedores/activos`);
                const providersMap = response.data.reduce((map, provider) => {
                    map[provider.id_proveedor] = provider.nombre;
                    return map;
                }, {});
                setProviders(providersMap);
            } catch (error) {
                console.error('Error al obtener proveedores:', error);
                alert('Error al obtener proveedores.');
            }
        };
        fetchProviders();
    }, []);

    useEffect(() => {
        handleFilterChange();
    }, [filterState, filterProveedor, filterOrderNumber, filterDate, orders]);

    const handleFilterChange = () => {
        const isFilterEmpty = 
            filterState === 'Todos' &&
            filterProveedor === '' &&
            filterOrderNumber === '' &&
            filterDate === '';

        if (isFilterEmpty) {
            setFilteredOrders(orders);
            return;
        }

        const filtered = orders.filter(order => {
            const orderDate = new Date(order.fecha_creacion);
            const formattedOrderDate = orderDate.toISOString().split('T')[0];
        
            return (
                (filterState === 'Todos' || order.estado === filterState) &&
                (filterProveedor === '' || (order.id_proveedor && order.id_proveedor.toLowerCase().includes(filterProveedor.toLowerCase()))) &&
                (filterOrderNumber === '' || (order.id_orden_de_compra && String(order.id_orden_de_compra).includes(filterOrderNumber))) &&
                (filterDate === '' || formattedOrderDate === filterDate)
            );
        });

        setFilteredOrders(filtered);
    };

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
        setSelectedOrder(order);
        
        if (order.estado === 'completada') {
            const receptionDetails = await fetchReceptionDetails(order.id_orden_de_compra);
            const receptionMap = {};

            receptionDetails.productos.forEach(productoArray => {
                productoArray.forEach(producto => {
                    receptionMap[producto.id_producto] = producto.cantidad_recibida;
                });
            });

            setProductReception(order.productos.map(producto => ({
                ...producto,
                cantidadRecibida: receptionMap[producto.id_producto] || 0,
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

    const renderActions = (estado, order) => {
        switch (estado) {
            case 'creada':
                return (
                    <>
                        <button className="orders-btn view" onClick={() => handleViewDetails(order)}><FontAwesomeIcon icon={faCircleInfo} style={{color: "#ffffff"}} /></button>
                        <button className="orders-btn accept" onClick={() => updateOrderStatus(order.id_orden_de_compra, 'aceptada')}>Aceptar</button>
                        <button className="orders-btn reject" onClick={() => updateOrderStatus(order.id_orden_de_compra, 'rechazada')}>Rechazar</button>
                    </>
                );
            case 'aceptada':
                return (
                    <>
                        <button className="orders-btn view" onClick={() => handleViewDetails(order)}><FontAwesomeIcon icon={faCircleInfo} style={{color: "#ffffff"}} /></button>
                        <button className="orders-btn complete" onClick={() => handleCompleteOrder(order)}>Completar</button>
                        <button className="orders-btn inactivate" onClick={() => updateOrderStatus(order.id_orden_de_compra, 'inactiva')}>Inactivar</button>
                    </>
                );
            case 'completada':
            case 'rechazada':
            case 'inactiva':
                return <button className="orders-btn view" onClick={() => handleViewDetails(order)}><FontAwesomeIcon icon={faCircleInfo} style={{color: "#ffffff"}} /></button>;
            default:
                return null;
        }
    };

    return (
        <div className="orders-container">
            {/* ...rest of the code */}
        </div>
    );
};

export default OrdenesDeCompra;
