import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddMechanic.css';
import { API_BASE_URL } from '../assets/config'; // Configuración del URL de la API

function AddMechanic() {
    const [mecanicoData, setMecanicoData] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        correo_electronico: '',
        especialidad: ''
    });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMecanicoData({ ...mecanicoData, [name]: value });
    };

    const handleAddMechanic = () => {
        // Enviar los datos del mecánico al servidor
        axios.post(`${API_BASE_URL}/mecanicos`, mecanicoData)
            .then(response => {
                console.log('Mecánico agregado:', response.data);
                navigate('/'); // Redirigir a la página principal después de agregar
            })
            .catch(error => {
                console.error('Error al agregar mecánico:', error);
            });
    };

    return (
        <div className="add-mecanico">
            <h2>Agregar Nuevo Mecánico</h2>
            <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={mecanicoData.nombre}
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={mecanicoData.apellido}
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="telefono"
                placeholder="Teléfono"
                value={mecanicoData.telefono}
                onChange={handleInputChange}
            />
            <input
                type="email"
                name="correo_electronico"
                placeholder="Correo Electrónico"
                value={mecanicoData.correo_electronico}
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="especialidad"
                placeholder="Especialidad"
                value={mecanicoData.especialidad}
                onChange={handleInputChange}
            />
            <button onClick={handleAddMechanic}>Agregar Mecánico</button>
        </div>
    );
}

export default AddMechanic;
