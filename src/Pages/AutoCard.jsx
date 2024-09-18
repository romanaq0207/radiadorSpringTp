import React from 'react';
import { Link } from 'react-router-dom';
import './AutoCard.css';

function AutoCard({ auto }) {
    return (
        <div className="auto-card">
            <h3>{auto.marca} {auto.modelo}</h3>
            <p><strong>Año:</strong> {auto.anio}</p>
            <p><strong>Kilometraje:</strong> {auto.kilometraje} km</p>
        <Link to={`/autos/${auto.id}`} className="detail-link">Ver detalles</Link>
        </div>
    );
}

export default AutoCard;
