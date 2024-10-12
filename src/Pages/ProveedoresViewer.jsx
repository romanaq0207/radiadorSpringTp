import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProveedoresViewer.css';

const proveedoresData = [
  // Datos iniciales de ejemplo
  {
    id: 1,
    nombre: 'Distribuidora ABC',
    cuil: '30-12345678-9',
    email: 'contacto@abcdistribuidora.com',
    direccion: 'Av. Siempre Viva 123, Buenos Aires',
    telefono: '011-1234-5678',
    activo: true
  },
  {
    id: 2,
    nombre: 'Servicios Logísticos XYZ',
    cuil: '30-98765432-1',
    email: 'info@logisticaxyz.com',
    direccion: 'Calle Falsa 456, Córdoba',
    telefono: '0351-5678-1234',
    activo: true
  },
  {
    id: 3,
    nombre: 'Distribuidora ABC',
    cuil: '30-12345678-9',
    email: 'contacto@abcdistribuidora.com',
    direccion: 'Av. Siempre Viva 123, Buenos Aires',
    telefono: '011-1234-5678',
    activo: true
  },
  {
    id: 4,
    nombre: 'Bulonera Atomic',
    cuil: '30-12322128-9',
    email: 'contacto@atomicbulon.com',
    direccion: 'Av. Buena Vista 2991, Tierra del Fuego',
    telefono: '011-1234-5678',
    activo: true
  },
  {
    id: 5,
    nombre: 'Distribuidora ABC',
    cuil: '30-12345678-9',
    email: 'contacto@abcdistribuidora.com',
    direccion: 'Av. Siempre Viva 123, Buenos Aires',
    telefono: '011-1234-5678',
    activo: true
  }
];

const ProveedoresViewer = () => {
  const [proveedores, setProveedores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const proveedoresActivos = proveedoresData.filter((proveedor) => proveedor.activo);
    setProveedores(proveedoresActivos);
  }, []);

  // Función para eliminar un proveedor (cambia su estado activo a false)
  const handleDelete = (id) => {
    setProveedores((prevProveedores) =>
      prevProveedores.filter((proveedor) => proveedor.id !== id)
    );
  };

  // Función para redirigir a la página de edición de proveedores
  const handleEdit = (id) => {
    navigate(`/edit-proveedor/${id}`);
  };

  return (
    <div className="proveedores-viewer">
      <h2>Lista de Proveedores Activos</h2>
      <button className="add-button" onClick={() => navigate('/agregar-proveedor')}>
        Agregar Proveedor
      </button>
      <div className="proveedores-list">
        {proveedores.length === 0 ? (
          <p>No hay proveedores activos disponibles.</p>
        ) : (
          proveedores.map((proveedor) => (
            <div key={proveedor.id} className="proveedor-card">
              <h3>{proveedor.nombre}</h3>
              <p>
                <strong>CUIL:</strong> {proveedor.cuil}
              </p>
              <p>
                <strong>Correo electrónico:</strong> {proveedor.email}
              </p>
              <p>
                <strong>Dirección:</strong> {proveedor.direccion}
              </p>
              <p>
                <strong>Teléfono:</strong> {proveedor.telefono}
              </p>
              <div className="action-buttons">
                <button
                  className="edit-button"
                  onClick={() => handleEdit(proveedor.id)}  // Redirige a la edición con el ID correcto
                >
                  Editar
                </button>
                <button className="delete-button" onClick={() => handleDelete(proveedor.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProveedoresViewer;
