import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../assets/config';
import './AddFlota.css';

function AddFlota() {
    const [flotaName, setFlotaName] = useState('');
    const [autosDisponibles, setAutosDisponibles] = useState([]);
    const [autosEnFlota, setAutosEnFlota] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');  // Estado para manejar el mensaje de error

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
        // Validar que se ingrese un nombre para la flota
        if (flotaName === '') {
            setError('Por favor, ingresa un nombre para la flota.');
            return;
        }

        // Validar que se haya agregado al menos un auto a la flota
        if (autosEnFlota.length === 0) {
            setError('Debes seleccionar al menos un auto para la flota.');
            return;
        }

        // Si todo es válido, se procede a guardar la flota
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
                setError('');  // Limpiar el error en caso de éxito
            })
            .catch(error => {
                console.error('Error al guardar flota:', error);
                alert('Error al guardar la flota');
            });
    };

    return (
        <div className="add-flota-container">
            <div className="input-container">

            <h2>Agregar Nueva Flota</h2>
            {error && <div className="error-banner">{error}</div>} {/* Mostrar el mensaje de error si existe */}
            
            <input
                type="text"
                placeholder="Nombre de la Flota"
                value={flotaName}
                onChange={(e) => setFlotaName(e.target.value)}
                className="flota-input"
            />
            <button className="save-flota-button" onClick={handleSaveFlota}>Guardar Flota</button>

            </div>

            <div className="cuadro-container">
            <div className="auto-list">
            <div className="filtrar-auto">
            <h3>Buscar Autos</h3>
            <input
                type="text"
                placeholder="Buscar por patente, marca o modelo"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flota-search-input"
            />
                </div>
          
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
            </div>

        </div>
    );
}

export default AddFlota;
