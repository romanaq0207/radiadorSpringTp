import React, { useState, useEffect } from 'react';
import './DriversManagement.css';
import Navbar from '../components/NavBar';
import axios from 'axios';  // Importamos axios para las peticiones
import { API_BASE_URL } from '../assets/config';  // Importar el URL base de la API
import { useNavigate } from 'react-router-dom';

function DriversManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredConductores, setFilteredConductores] = useState([]);
    const navigate = useNavigate();

    // Cargar datos de conductores desde la API
    useEffect(() => {
        axios.get(`${API_BASE_URL}/conductores`)
            .then(response => {
                setFilteredConductores(response.data); // Cargar los datos de la API
            })
            .catch(error => {
                console.error('Error al obtener los conductores:', error);
            });
    }, []);

    const handleSearchChange = (event) => {
        const term = event.target.value;
        setSearchTerm(term);
        filterConductores(term);
    };

    const filterConductores = (term) => {
        const filtered = filteredConductores.filter(conductor =>
            conductor.nombre.toLowerCase().includes(term.toLowerCase()) ||
            conductor.apellido.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredConductores(filtered);
    };

    const handleAddConductor = () => {
        navigate('/agregar-conductor'); 
    };

    return (
        <div className="drivers-management-container">
            <Navbar />
            <h2 className="title">Gestión de Conductores</h2>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Buscar por nombre o apellido..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="drivers-search-input"
                />
                <button onClick={handleAddConductor} className="add-button">
                    Agregar Conductor
                </button>
            </div>
            
            <div className="drivers-list">
                {filteredConductores.length > 0 ? (
                    filteredConductores.map(conductor => (
                        <div
                            key={conductor.id}
                            className="drivers-card"
                        >
                            <p><strong>Nombre:</strong> {conductor.nombre} {conductor.apellido}</p>
                            <p><strong>DNI:</strong> {conductor.dni}</p>
                            <p><strong>Teléfono:</strong> {conductor.telefono}</p>
                        </div>
                    ))
                ) : (
                    <p>No se encontraron conductores.</p>
                )}
            </div>
        </div>
    );
}

export default DriversManagement;
