import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./AddProveedor.css"; // Reusing the same CSS file

const proveedoresData = [
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
  }
];

const EditProveedor = () => {
  const { id } = useParams();
  const [proveedor, setProveedor] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const proveedorEncontrado = proveedoresData.find((p) => p.id === parseInt(id));
    if (proveedorEncontrado) {
      setProveedor(proveedorEncontrado);
    }
  }, [id]);

  // Validaciones
  const validate = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-Z\s]+$/; // Solo letras y espacios
    const cuilRegex = /^\d{2}-\d{8}-\d{1}$/; // CUIL en formato nn-nnnnnnnn-n
    const addressRegex = /^[A-Za-z0-9\s,]+$/; // Letras, números, comas y espacios
    const phoneRegex = /^\d{8}$|^\d{10}$/; // 8 o 10 dígitos para teléfono

    if (!proveedor.nombre || !nameRegex.test(proveedor.nombre)) {
      newErrors.nombre = 'El nombre solo debe contener letras y espacios.';
    }

    if (!proveedor.cuil || !cuilRegex.test(proveedor.cuil)) {
      newErrors.cuil = 'El CUIL debe seguir el formato 12-34567890-1.';
    }

    if (!proveedor.email) {
      newErrors.email = 'El correo es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(proveedor.email)) {
      newErrors.email = 'El correo no es válido.';
    }

    if (!proveedor.direccion || !addressRegex.test(proveedor.direccion)) {
      newErrors.direccion = 'La dirección solo debe contener letras, números y espacios.';
    }

    if (!proveedor.telefono || !phoneRegex.test(proveedor.telefono)) {
      newErrors.telefono = 'Ingrese un número de telefono válido para la Rep. Argentina';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      console.log("Cambios guardados:", proveedor);
      navigate("/"); // Redirect after saving
    }
  };

  if (!proveedor) {
    return <p>Proveedor no encontrado</p>;
  }

  return (
    <div className="add-proveedor-container"> {/* Use the same container class */}
      <h2>Editar Proveedor</h2>
      <form className="add-proveedor-form" onSubmit={handleSubmit}> {/* Same form class */}
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            value={proveedor.nombre}
            onChange={(e) => setProveedor({ ...proveedor, nombre: e.target.value })}
            required
          />
          {errors.nombre && <span className="error">{errors.nombre}</span>} {/* Error message */}
        </div>

        <div className="form-group">
          <label>CUIL:</label>
          <input
            type="text"
            value={proveedor.cuil}
            onChange={(e) => setProveedor({ ...proveedor, cuil: e.target.value })}
            required
          />
          {errors.cuil && <span className="error">{errors.cuil}</span>} {/* Error message */}
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={proveedor.email}
            onChange={(e) => setProveedor({ ...proveedor, email: e.target.value })}
            required
          />
          {errors.email && <span className="error">{errors.email}</span>} {/* Error message */}
        </div>

        <div className="form-group">
          <label>Dirección:</label>
          <input
            type="text"
            value={proveedor.direccion}
            onChange={(e) => setProveedor({ ...proveedor, direccion: e.target.value })}
            required
          />
          {errors.direccion && <span className="error">{errors.direccion}</span>} {/* Error message */}
        </div>

        <div className="form-group">
          <label>Teléfono:</label>
          <input
            type="tel"
            value={proveedor.telefono}
            onChange={(e) => setProveedor({ ...proveedor, telefono: e.target.value })}
            required
          />
          {errors.telefono && <span className="error">{errors.telefono}</span>} {/* Error message */}
        </div>

        <button type="submit" className="submit-button">Guardar Cambios</button> {/* Same button class */}
      </form>
    </div>
  );
};

export default EditProveedor;
