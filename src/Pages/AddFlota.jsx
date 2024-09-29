import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../assets/config';
import './AddFlota.css';

function AddFlota() {
    const [flotaName, setFlotaName] = useState('');
    const [autosDisponibles, setAutosDisponibles] = useState([]);
    const [autosEnFlota, setAutosEnFlota] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Obtener autos disponibles desde el servidor
        axios.get(`${API_BASE_URL}/autos`)
            .then(response => {
                setAutosDisponibles(response.data);
            })
            .catch(error => {
                console.error('Error al obtener autos disponibles:', error);
            });
    }, []);

    const handleAddAutoToFlota = (auto) => {
        if (!autosEnFlota.includes(auto)) {
            setAutosEnFlota([...autosEnFlota, auto]);
        }
    };

    const handleRemoveAutoFromFlota = (auto) => {
        setAutosEnFlota(autosEnFlota.filter(item => item.id !== auto.id));
    };

    const handleSaveFlota = () => {
        if (flotaName === '') {
            alert('Por favor, ingresa un nombre para la flota.');
            return;
        }
        
        const flotaData = {
            nombre: flotaName,
            autos: autosEnFlota.map(auto => auto.id)
        };

        axios.post(`${API_BASE_URL}/flotas`, flotaData)
            .then(response => {
                console.log('Flota guardada:', response.data);
                alert('Flota guardada con éxito');
                setFlotaName('');
                setAutosEnFlota([]);
            })
            .catch(error => {
                console.error('Error al guardar flota:', error);
                alert('Error al guardar la flota');
            });
    };

    return (
        <div className="add-flota-container">
            <h2>Agregar Nueva Flota</h2>
            <input
                type="text"
                placeholder="Nombre de la Flota"
                value={flotaName}
                onChange={(e) => setFlotaName(e.target.value)}
                className="flota-input"
            />

            <h3>Buscar Autos</h3>
            <input
                type="text"
                placeholder="Buscar por patente, marca o modelo"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flota-search-input"
            />

            <div className="auto-list">
                <h3>Autos Disponibles</h3>
                {autosDisponibles
                    .filter(auto =>
                        auto.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        auto.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        auto.nro_patente.toLowerCase().includes(searchTerm.toLowerCase()) // Búsqueda por patente
                    )
                    .map(auto => (
                        <div key={auto.id} className="auto-item">
                            <p>{auto.marca} {auto.modelo} - {auto.nro_patente}</p>
                            <button className="add-auto-button" onClick={() => handleAddAutoToFlota(auto)}>Agregar</button>
                        </div>
                    ))}
            </div>

            <div className="flota-list">
                <h3>Autos en la Flota</h3>
                {autosEnFlota.length > 0 ? (
                    autosEnFlota.map(auto => (
                        <div key={auto.id} className="flota-item">
                            <p>{auto.marca} {auto.modelo} - {auto.nro_patente}</p>
                            <button className="remove-auto-button" onClick={() => handleRemoveAutoFromFlota(auto)}>Eliminar</button>
                        </div>
                    ))
                ) : (
                    <p>No hay autos en la flota</p>
                )}
            </div>

            <button className="save-flota-button" onClick={handleSaveFlota}>Guardar Flota</button>
        </div>
    );
}

export default AddFlota;
