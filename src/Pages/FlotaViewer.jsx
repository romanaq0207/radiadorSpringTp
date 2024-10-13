import React, { useState, useEffect } from 'react';
import flotasData from '../data/flotas.json'; 
import './FlotaViewer.css';

function FlotaViewer() {
    const [flotasDisponibles, setFlotasDisponibles] = useState([]); 
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Cargar flotas desde el archivo flotas.json
        setFlotasDisponibles(flotasData.flotas); // Asegúrate de que la estructura en el JSON sea correcta
    }, []);

    const filteredFlotas = flotasDisponibles.filter(flota => 
       flota.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="add-flota-container">
            <h3>Buscar Flota</h3>
            <input
                type="text"
                placeholder="Buscar por nombre o auto"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flota-search-input"
            />

            <div className="flota-list">
                {filteredFlotas.length > 0 ? (
                    filteredFlotas.map(flota => (
                        <div key={flota.id} className="flota-item">
                         <p>
                            <strong>Nombre:</strong> {flota.nombre}
                         </p>
                         <p>
                            <strong>Estado:</strong> {flota.estado}
                         </p>
                         <p>
                             <strong>La flota esta siendo utilizada:</strong> {flota.en_uso}
                         </p>
                        </div>
                    ))
                ) : (
                    <p>No se encontraron flotas.</p>
                )}
            </div>
        </div>
    );
}

export default FlotaViewer;
