import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddDrivers.css';
import { API_BASE_URL } from '../assets/config';

function AddDrivers() {
    const [conductorData, setConductorData] = useState({
        nombre: '',
        apellido: '',
        dni: '',
        telefono: '',  // Nuevo campo para el número de teléfono
    });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setConductorData({ ...conductorData, [name]: value });  // Corregido: conductorData en minúsculas
    };

    const handleAddDrivers = () => {
        // Enviar los datos del conductor al servidor
        axios.post(`${API_BASE_URL}/conductor`, conductorData)
            .then(response => {
                console.log('Conductor agregado:', response.data);
                navigate('/'); // Redirige a la página principal
            })
            .catch(error => {
                console.error('Error al agregar conductor:', error);
            });
    };

    return (
        <div className="add-conductor">
            <h2>Agregar Nuevo Conductor</h2>
            <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={conductorData.nombre}
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={conductorData.apellido}
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="dni"
                placeholder="DNI"
                value={conductorData.dni}
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="telefono"
                placeholder="Número de Teléfono"
                value={conductorData.telefono}
                onChange={handleInputChange}
            />
            <button onClick={handleAddDrivers}>Agregar Conductor</button>
        </div>
    );
}

export default AddDrivers;
