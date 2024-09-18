import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './AutoDetail.css';
import { API_BASE_URL } from '../assets/config'; 


function AutoDetail() {
    const { id } = useParams();  // Obtiene el ID del auto de la URL
    const [auto, setAuto] = useState(null);
    const [mantenimientos, setMantenimientos] = useState([]);
    const [newMantenimiento, setNewMantenimiento] = useState({ fecha: '', tipo_de_mantenimiento: '', descripcion: '' });

    useEffect(() => {
        // Obtener los detalles del auto desde el backend
        axios.get(`${API_BASE_URL}/autos/${id}`)
            .then(response => {
                setAuto(response.data);
            })
            .catch(error => {
                console.error('Error al obtener los detalles del auto:', error);
            });

        // Obtener el historial de mantenimiento desde el backend
        axios.get(`${API_BASE_URL}/autos/${id}/mantenimientos`)
            .then(response => {
                setMantenimientos(response.data);
            })
            .catch(error => {
                console.error('Error al obtener el historial de mantenimiento:', error);
            });
    }, [id]);  // Se ejecuta cuando cambia el ID del auto

    if (!auto) {
        return <p>Auto no encontrado</p>;
    }

    const handleAddMantenimiento = () => {
        const mantenimientoData = {
            auto_id: auto.id,
            ...newMantenimiento
        };

        // Enviar el nuevo mantenimiento al backend
        axios.post(`${API_BASE_URL}/autos/${id}/mantenimientos`, mantenimientoData)
            .then(response => {
                setMantenimientos([...mantenimientos, response.data]);
                setNewMantenimiento({ fecha: '', tipo_de_mantenimiento: '', descripcion: '' });
            })
            .catch(error => {
                console.error('Error al agregar mantenimiento:', error);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMantenimiento(prevState => ({ ...prevState, [name]: value }));
    };

    return (
        <div className="auto-detail">
            <h2>Detalles del Auto</h2>
            <h3>{auto.marca} {auto.modelo}</h3>
            <p><strong>Año:</strong> {auto.anio}</p>
            <p><strong>Kilometraje:</strong> {auto.kilometraje} km</p>
            <p><strong>Pantente: </strong> {auto.nro_patente}</p>

            <h3>Historial de Mantenimiento</h3>
            {mantenimientos.length > 0 ? (
                <table className="maintenance-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Tipo de Mantenimiento</th>
                            <th>Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mantenimientos.map((item, index) => (
                            <tr key={index}>
                                <td>{item.fecha}</td>
                                <td>{item.tipo_de_mantenimiento}</td>
                                <td>{item.descripcion}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No se encontraron registros de mantenimiento.</p>
            )}

            <h3>Agregar Mantenimiento</h3>
            <input
                type="text"
                name="fecha"
                placeholder="Fecha (YYYY-MM-DD)"
                value={newMantenimiento.fecha}
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="tipo_de_mantenimiento"
                placeholder="Tipo de Mantenimiento"
                value={newMantenimiento.tipo_de_mantenimiento}
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="descripcion"
                placeholder="Descripción"
                value={newMantenimiento.descripcion}
                onChange={handleInputChange}
            />
            <button onClick={handleAddMantenimiento}>Agregar Mantenimiento</button>

            <Link to="/" className="back-link">Volver a la búsqueda</Link>
        </div>
    );
}

export default AutoDetail;
