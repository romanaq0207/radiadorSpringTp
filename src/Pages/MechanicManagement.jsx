import React, { useState, useEffect } from 'react';
import './MechanicManagement.css';
import Navbar from '../components/NavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare,faTrash} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { API_BASE_URL } from '../assets/config';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function MechanicManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMecanicos, setFilteredMecanicos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_BASE_URL}/mecanicos`)
            .then(response => setFilteredMecanicos(response.data))
            .catch(error => console.error('Error al obtener los mecánicos:', error));
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

    const handleEditMechanic = (id) => {
        navigate(`/edit-mechanic/${id}`);  
    };

    const handleDeleteMechanic = (id) => {
        Swal.fire({
          title: '¿Estás seguro?',
          text: "Esta acción no se puede deshacer.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, dar de baja',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
           //dar de baja mecanico (supongo que poner un flag en false)
    
            Swal.fire(
              '¡Hecho!',
              'El mecanico ha sido dado de baja.',
              'success'
            );
          }
        });
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
                    +
                </button>
            </div>
            
            <div className="mechanic-list">
                {filteredMecanicos.length > 0 ? (
                    filteredMecanicos.map(mecanico => (
                        <div key={mecanico.id} className="mechanic-card">
                            <p><strong>Nombre:</strong> {mecanico.nombre} {mecanico.apellido}</p>
                            <p><strong>Teléfono:</strong> {mecanico.telefono}</p>
                            <p><strong>Correo Electrónico:</strong> {mecanico.correo_electronico}</p>
                            <p><strong>Especialidad:</strong> {mecanico.especialidad}</p>
                            <button onClick={() => handleEditMechanic(mecanico.id)} className="edit-button">
                            <FontAwesomeIcon icon={faPenToSquare} style={{color: "#ffffff",}} />
                            </button>
                            <button onClick={() => handleDeleteMechanic(mecanico.id)} className="delete-button">
                            <FontAwesomeIcon icon={faTrash} style={{color: "#ffffff",}} />
                            </button>
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
