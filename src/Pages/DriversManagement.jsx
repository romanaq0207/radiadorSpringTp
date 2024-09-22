import React, { useState, useEffect } from 'react';
import conductoresData from '../data/conductores.json'; // Ajusta la ruta según tu estructura
import './DriversManagement.css';

const DriversManagement = () => {
  const [conductores, setConductores] = useState([]);

  useEffect(() => {
    // Cargar los datos del archivo JSON y filtrar los habilitados
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
      setConductores([
        ...conductores,
        { ...formData, id: conductores.length + 1 },
      ]);
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
    // Cambiar el estado de habilitado a false para el conductor que se elimina
    setConductores(
      conductores.map((conductor) =>
        conductor.id === id ? { ...conductor, habilitado: false } : conductor
      )
    );
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
        {/* Filtrar conductores habilitados para mostrarlos */}
        {conductores.filter(conductor => conductor.habilitado).map((conductor) => (
          <div key={conductor.id} className="drivers-card">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriversManagement;
