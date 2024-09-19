import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddClients.css';
import { API_BASE_URL } from '../assets/config';

function AddClients() {
    const [clienteData, setClienteData] = useState({
        nombre: '',
        apellido: '',
        dni: '',
        telefono: '',  // Nuevo campo para el número de teléfono
    });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setClienteData({ ...clienteData, [name]: value });
    };

    const handleAddCliente = () => {
        // Enviar los datos del cliente al servidor
        axios.post(`${API_BASE_URL}/clientes`, clienteData)
            .then(response => {
                console.log('Cliente agregado:', response.data);
                navigate('/'); // Redirige a la página principal
            })
            .catch(error => {
                console.error('Error al agregar cliente:', error);
            });
    };

    return (
        <div className="add-cliente">
            <h2>Agregar Nuevo Cliente</h2>
            <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={clienteData.nombre}
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={clienteData.apellido}
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="dni"
                placeholder="DNI"
                value={clienteData.dni}
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="telefono"
                placeholder="Número de Teléfono"
                value={clienteData.telefono}
                onChange={handleInputChange}
            />
            <button onClick={handleAddCliente}>Agregar Cliente</button>
        </div>
    );
}

export default AddClients;
