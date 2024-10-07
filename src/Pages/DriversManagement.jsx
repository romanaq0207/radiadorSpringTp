import React, { useState, useEffect } from 'react';
import conductoresData from '../data/conductores.json';
import './DriversManagement.css';
import { API_BASE_URL } from '../assets/config';  // Asegúrate de que esta ruta sea correcta

const DriversManagement = () => {
  const [conductores, setConductores] = useState([]);
  const [ubicaciones, setUbicaciones] = useState({}); // Estado para las ubicaciones

  useEffect(() => {
    setConductores(conductoresData.filter((conductor) => conductor.habilitado));
  }, []);

  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    apellido: '',
    dni: '',
    numeroTelefono: '',
    habilitado: true,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/; 
    const dniRegex = /^(\d{1,2}\.?\d{3}\.?\d{3}|\d{1,8})$/;
    const phoneRegex = /^\d{8}|\d{10}$/; 

    if (!nameRegex.test(formData.nombre)) {
      alert('El nombre solo puede contener letras y espacios.');
      return;
    }

    if (!nameRegex.test(formData.apellido)) {
      alert('El apellido solo puede contener letras y espacios.');
      return;
    }

    if (!dniRegex.test(formData.dni)) {
      alert('El DNI debe tener un formato válido');
      return;
    }

    if (!phoneRegex.test(formData.numeroTelefono)) {
      alert('El número de teléfono debe tener 8 o 10 dígitos.');
      return;
    }

    // Si pasa las validaciones, continuar con el submit
    if (isEditing) {
      setConductores(
        conductores.map((conductor) =>
          conductor.id === formData.id ? formData : conductor
        )
      );
      setIsEditing(false);
    } else {
      setConductores([ ...conductores, { ...formData, id: conductores.length + 1 } ]);
    }

    // Reset del formulario
    setFormData({
      id: '',
      nombre: '',
      apellido: '',
      dni: '',
      numeroTelefono: '',
      habilitado: true,
    });
  };

  const handleEdit = (id) => {
    const conductor = conductores.find((conductor) => conductor.id === id);
    setFormData(conductor);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    setConductores(
      conductores.map((conductor) =>
        conductor.id === id ? { ...conductor, habilitado: false } : conductor
      )
    );
  };

// Función para obtener la última ubicación del conductor
const fetchUbicacion = async () => { // Eliminamos el parámetro id
  try {
    const response = await fetch(`${API_BASE_URL}/ubicacion-conductor`); // No necesitas el id aquí
    if (!response.ok) {
      throw new Error('Error al obtener la ubicación');
    }
    const data = await response.json();
    setUbicaciones((prev) => ({ ...prev, [1]: data })); // Usa siempre el ID 1, si es necesario
  } catch (error) {
    console.error('Error:', error);
    alert('No se pudo obtener la ubicación del conductor');
  }
};


  return (
    <div className="drivers-management-container">
      <h2 className="title">Gestión de Conductores</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={formData.apellido}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="dni"
          placeholder="DNI"
          value={formData.dni}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="numeroTelefono"
          placeholder="Número de Teléfono"
          value={formData.numeroTelefono}
          onChange={handleChange}
          required
        />
        <button type="submit" className="add-button">
          {isEditing ? 'Modificar Conductor' : 'Agregar Conductor'}
        </button>
      </form>

      <div className="drivers-list">
        {conductores.filter(conductor => conductor.habilitado).map((conductor) => (
          <div key={conductor.id} className="drivers-card" id="drivers-card">
            <p>
              <strong>Nombre:</strong> {conductor.nombre} {conductor.apellido}
            </p>
            <p>
              <strong>DNI:</strong> {conductor.dni}
            </p>
            <p>
              <strong>Teléfono:</strong> {conductor.numeroTelefono}
            </p>

            <button onClick={() => handleEdit(conductor.id)} className="add-button">
              Editar
            </button>
            <button onClick={() => handleDelete(conductor.id)} className="add-button">
              Eliminar
            </button>
            <button onClick={() => fetchUbicacion(conductor.id)} className="add-button">
              Mostrar Ubicación
            </button>

            {/* Mostrar la ubicación si está disponible */}
            {ubicaciones[conductor.id] && (
              <div>
                <p><strong>Última Ubicación:</strong></p>
                <p>Latitud: {ubicaciones[conductor.id].latitud}</p>
                <p>Longitud: {ubicaciones[conductor.id].longitud}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriversManagement;
