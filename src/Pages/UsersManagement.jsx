import React, { useState, useEffect } from "react";
import usuariosData from "../data/usuarios.json";
import "./UsersManagement.css";

const UsersManagement = () => {
  const [usuarios, setUsuarios] = useState([]);
  useEffect(() => {
    // Cargar los datos del archivo JSON
    setUsuarios(usuariosData.filter((usuario) => usuario.habilitado));
  }, []);

  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    apellido: "",
    dni: "",
    mail: "",
    rol: "",
    habilitado: true,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Validar que el nombre solo contenga letras y espacios
    if (!/^[a-zA-Z\s]+$/.test(formData.nombre)) {
      newErrors.nombre = "El nombre solo puede contener letras y espacios.";
    }

    // Validar que el apellido solo contenga letras y espacios
    if (!/^[a-zA-Z\s]+$/.test(formData.apellido)) {
      newErrors.apellido = "El apellido solo puede contener letras y espacios.";
    }

    // Validar que el DNI solo contenga números
    if (!/^\d+$/.test(formData.dni)) {
      newErrors.dni = "El DNI solo puede contener números.";
    }

    // Validar que el email tenga un formato válido
    if (
      !/^[\w-]+(\.[\w-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})$/.test(
        formData.mail
      )
    ) {
      newErrors.mail = "El formato del correo no es válido.";
    }

    setErrors(newErrors);

    // Si no hay errores, el formulario es válido
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      if (isEditing) {
        setUsuarios(
          usuarios.map((usuario) =>
            usuario.id === formData.id ? formData : usuario
          )
        );
        setIsEditing(false);
      } else {
        setUsuarios([...usuarios, { ...formData, id: usuarios.length + 1 }]);
      }

      // Resetear el formulario después de enviar
      setFormData({
        id: "",
        nombre: "",
        apellido: "",
        dni: "",
        mail: "",
        rol: "",
        habilitado: true,
      });
    }
  };

  const handleEdit = (id) => {
    const usuario = usuarios.find((usuario) => usuario.id === id);
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

  const handleCancel = () => {
    setFormData({
      id: "",
      nombre: "",
      apellido: "",
      dni: "",
      mail: "",
      rol: "",
      habilitado: true,
    });
    setIsEditing(false);
  };

  return (
    <div className="users-management-container">
      <div className="filter-container">
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
          {errors.nombre && <p className="error-message">{errors.nombre}</p>}

          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
          />
          {errors.apellido && (
            <p className="error-message">{errors.apellido}</p>
          )}

          <input
            type="text"
            name="dni"
            placeholder="DNI"
            value={formData.dni}
            onChange={handleChange}
            required
          />
          {errors.dni && <p className="error-message">{errors.dni}</p>}

          <input
            type="text"
            name="mail"
            placeholder="Mail"
            value={formData.mail}
            onChange={handleChange}
            required
          />
          {errors.mail && <p className="error-message">{errors.mail}</p>}

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
            {isEditing ? "Modificar Usuario" : "Agregar Usuario"}
          </button>
          <button
            onClick={handleCancel}
            disabled={!isEditing}
            className="btn-cancelar-usuarios"
          >
            Cancelar
          </button>
        </form>
      </div>

      <div className="users-list">
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

            <button
              onClick={() => handleEdit(usuario.id)}
              className="add-button"
            >
              Editar
            </button>
            <button
              onClick={() => handleDelete(usuario.id)}
              className="edit-button"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersManagement;
