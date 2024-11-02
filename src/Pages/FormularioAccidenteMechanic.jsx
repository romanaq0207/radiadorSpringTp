import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FormularioAccidenteMechanic.css';

const FormularioAccidenteMechanic = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false); // Estado para controlar la visualización del formulario

  const [stock, setStock] = useState([
    { id: 1, nombre: 'Producto A', cantidad: 0, seleccionado: false },
    { id: 2, nombre: 'Producto B', cantidad: 0, seleccionado: false },
    { id: 3, nombre: 'Producto C', cantidad: 0, seleccionado: false },
  ]);

  const handleCheckboxChange = (id) => {
    setStock(stock.map(item => item.id === id ? { ...item, seleccionado: !item.seleccionado } : item));
  };

  const handleCantidadChange = (id, value) => {
    setStock(stock.map(item => item.id === id ? { ...item, cantidad: Math.max(0, value) } : item));
  };

  const handleTokenSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para validar el token, si es necesario.
    // Si el token es válido, mostramos el formulario.
    if (token.trim()) {
      setShowForm(true);
    } else {
      alert("Por favor ingresa un token válido.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!descripcion) {
      setError('La descripción no puede estar vacía.');
      return;
    }
    
    const productosSeleccionados = stock.filter(item => item.seleccionado && item.cantidad > 0);
    if (productosSeleccionados.length === 0) {
      setError('Debes seleccionar al menos un producto con una cantidad válida.');
      return;
    }

    if (!ubicacion) {
      setError('Debes seleccionar una ubicación (taller o misma ubicación).');
      return;
    }

    // Si todas las validaciones son correctas, continuar
    setError(''); // Reiniciar el error
    if (window.confirm("¿Estás seguro de que quieres finalizar con el formulario?")) {
      // Aquí podrías manejar la lógica de envío
      console.log({ descripcion, stock });
      navigate('/busqueda-auto-mecanico'); // Redirigir al usuario
    }
  };

  return (
    <div>
      {!showForm ? (
        <form className="token-form" onSubmit={handleTokenSubmit}>
          <label htmlFor="token">Ingrese su token:</label>
          <input 
            type="text" 
            id="token" 
            value={token} 
            onChange={(e) => setToken(e.target.value)} 
            required 
          />
          <button type="submit">Enviar Token</button>
        </form>
      ) : (
        <form className="formulario-accidente" onSubmit={handleSubmit}>
          <label>Descripción del problema:</label>
          <textarea 
            value={descripcion} 
            onChange={(e) => setDescripcion(e.target.value)} 
            rows="4" 
            required 
          />
          
          {error && <div className="error-alert">{error}</div>} {/* Alerta de error */}

          <label>Productos utilizados:</label>
          <div className="productos-lista">
            {stock.map((producto) => (
              <div key={producto.id} className="producto-item">
                <input 
                  type="checkbox" 
                  checked={producto.seleccionado} 
                  onChange={() => handleCheckboxChange(producto.id)} 
                />
                <label>{producto.nombre}</label>
                <input 
                  type="number" 
                  value={producto.seleccionado ? producto.cantidad : ''} 
                  onChange={(e) => handleCantidadChange(producto.id, parseInt(e.target.value) || 0)} 
                  disabled={!producto.seleccionado} 
                  min="0" 
                />
              </div>
            ))}
          </div>

          <div className="ubicacion-opciones">
            <label>
              <input 
                type="radio" 
                name="ubicacion" 
                value="taller" 
                checked={ubicacion === 'taller'} 
                onChange={() => setUbicacion('taller')} 
              />
              Taller
            </label>
            <label>
              <input 
                type="radio" 
                name="ubicacion" 
                value="misma_ubicacion" 
                checked={ubicacion === 'misma_ubicacion'} 
                onChange={() => setUbicacion('misma_ubicacion')} 
              />
              Misma Ubicación
            </label>
          </div>

          <button type="submit">Enviar</button>
        </form>
      )}
    </div>
  );
};

export default FormularioAccidenteMechanic;
