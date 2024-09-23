import React, { useState, useEffect } from 'react';
import usuariosData from '../data/usuarios.json'; 
import './UsersManagement.css'; 

const UsersManagement = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    // Cargar los datos del archivo JSON
    setUsuarios(usuariosData.filter((usuario) => usuario.habilitado));
  }, []);

  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    apellido: '',
    dni: '',
    mail: '',
    rol: '',
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

    if (isEditing) {
      setUsuarios(
        usuarios.map((usuario) =>
          usuarios.id === formData.id ? formData : usuario
        )
      );
      setIsEditing(false);
    } else {
      setUsuarios([
        ...usuarios,
        { ...formData, id: usuarios.length + 1 },
      ]);
    }

    setFormData({
      id: '',
      nombre: '',
      apellido: '',
      dni: '',
      mail: '',
      rol: '',
      habilitado: true,
    });
  };

  const handleEdit = (id) => {
    const usuario = usuarios.find((usuario) => usuiario.id === id);
    setFormData(usuario);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    setUsuarios(
      usuarios.map((usuario) =>
        usuario.id === id ? { ...usuario, habilitado: false } : usuario
      )
    );
  };

  return (
    <div className="users-management-container">
      
      <div className="filter-conteiner">
      <h2 className="title">Gestión de Usuarios</h2>
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
          name="mail"
          placeholder="Mail"
          value={formData.mail}
          onChange={handleChange}
          required
        />
        <select
        type="text"
        name="rol"
        placeholder="Rol"
        value={formData.rol}
        onChange={handleChange}
        required
        >
        <option value="">Selecciona una opción</option>
        <option value="operador">Operador</option>
        <option value="administrador">Administrador</option>
        <option value="cliente">Cliente</option>
        <option value="gerencia">Gerencia</option>
        </select>
        
        <button type="submit" className="add-button">
          {isEditing ? 'Modificar Usuario' : 'Agregar Usuario'}
        </button>
      </form>
      </div>

      <div className="drivers-list">
        {usuarios.map((usuario) => (
          <div key={usuario.id} className="user-card">
            <p>
              <strong>Nombre:</strong> {usuario.nombre} {usuario.apellido}
            </p>
            <p>
              <strong>DNI:</strong> {usuario.dni}
            </p>
            <p>
              <strong>Mail:</strong> {usuario.mail}
            </p>
            <p>
              <strong>Rol:</strong> {usuario.rol}
            </p>

            <button onClick={() => handleEdit(usuario.id)} className="add-button">
              Editar
            </button>
            <button onClick={() => handleDelete(usuario.id)} className="edit-button">
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersManagement;