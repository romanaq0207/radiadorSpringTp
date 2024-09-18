import React, { useState, useEffect } from 'react';
import './MechanicManagement.css';
import Navbar from '../components/NavBar';
import axios from 'axios';  // Importamos axios para las peticiones
import { API_BASE_URL } from '../assets/config';  // Importar el URL base de la API
import { useNavigate } from 'react-router-dom';

function MechanicManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMecanicos, setFilteredMecanicos] = useState([]);
    const navigate = useNavigate();

    // Cargar datos de mecánicos desde la API
    useEffect(() => {
        axios.get(`${API_BASE_URL}/mecanicos`)
            .then(response => {
                setFilteredMecanicos(response.data); // Cargar los datos de la API
            })
            .catch(error => {
                console.error('Error al obtener los mecánicos:', error);
            });
    }, []);

    const handleSearchChange = (event) => {
        const term = event.target.value;
        setSearchTerm(term);
        filterMecanicos(term);
    };

    const filterMecanicos = (term) => {
        const filtered = filteredMecanicos.filter(mecanico =>
            mecanico.nombre.toLowerCase().includes(term.toLowerCase()) ||
            mecanico.apellido.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredMecanicos(filtered);
    };

    const handleAddMechanic = () => {
        navigate('/agregar-mecanico'); 
    };

    return (
        <div className="mechanic-management-container">
            <Navbar />
            <h2 className="title">Gestión de Mecánicos</h2>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Buscar por nombre o apellido..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="mechanic-search-input"
                />
                <button onClick={handleAddMechanic} className="add-button">
                    Agregar Mecánico
                </button>
            </div>
            
            <div className="mechanic-list">
                {filteredMecanicos.length > 0 ? (
                    filteredMecanicos.map(mecanico => (
                        <div
                            key={mecanico.id}
                            className="mechanic-card"
                        >
                            <p><strong>Nombre:</strong> {mecanico.nombre} {mecanico.apellido}</p>
                            <p><strong>Especialidad:</strong> {mecanico.especialidad}</p>
                        </div>
                    ))
                ) : (
                    <p>No se encontraron mecánicos.</p>
                )}
            </div>
        </div>
    );
}

export default MechanicManagement;
