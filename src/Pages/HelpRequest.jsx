import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './HelpRequest.css';
import axios from 'axios';
import { API_BASE_URL } from '../assets/config';

const HelpRequest = () => {
  const [showDescriptionField, setShowDescriptionField] = useState(false);
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [patente, setPatente] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [latitud, setLatitud] = useState(null); // Estado para latitud
  const [longitud, setLongitud] = useState(null); // Estado para longitud
  const navigate = useNavigate();

  const patenteRegex = /^([a-zA-Z]{3}\d{3}|[a-zA-Z]{2}\d{3}[a-zA-Z]{2})$/;

  const generateToken = () => {
    const newToken = Math.floor(100000 + Math.random() * 900000).toString();
    setToken(newToken);
  };

  const handleHelpRequest = () => {
    if (!patenteRegex.test(patente)) {
      setError('Formato de patente incorrecto');
      return;
    }
    setError('');

    // Obtener la geolocalización
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitud(position.coords.latitude);
          setLongitud(position.coords.longitude);

          Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Deseas pedir servicio de acarreo?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              generateToken();
              setShowDescriptionField(true);
            }
          });
        },
        (error) => {
          console.error('Error obteniendo la ubicación', error);
          Swal.fire('Error', 'No se pudo obtener la ubicación', 'error');
        }
      );
    } else {
      Swal.fire('Error', 'La geolocalización no es soportada en este navegador', 'error');
    }
  };

  const handleSendDescription = () => {
    Swal.fire({
      title: '¿Deseas enviar una foto?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, enviar foto',
      cancelButtonText: 'No, continuar sin foto'
    }).then((result) => {
      if (result.isConfirmed) {
        setShowDescriptionField(false);
        document.getElementById('photoInput').click();
      } else {
        setShowDescriptionField(false);
        setShowToken(true);
        sendHelpRequest();
      }
    });
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result); // Guarda la imagen en base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendPhoto = () => {
    setShowToken(true);
    sendHelpRequest();
    setPhoto(null);
    Swal.fire('Enviado', 'Tu foto ha sido enviada con éxito', 'success');
  };

  const sendHelpRequest = async () => {
    console.log(`${API_BASE_URL}/solicitudes`);
  
    const requestData = {
      id_conductor: 1, // Asegúrate de que este id es correcto
      id_mecanico: 1, // Asegúrate de que este id es correcto
      patente_auto: patente,
      token: token,
      descripcion: description || "", // Si está vacío, envía cadena vacía
      foto: photo || "", // Si no hay foto, envía cadena vacía
      latitud: latitud, // Verifica que tengas valores válidos
      longitud: longitud, // Verifica que tengas valores válidos
      estado: 'pendiente',
      fecha_solicitud: new Date().toISOString().split("T")[0], // Prueba enviando solo la fecha
    };
  
    try {
      const response = await axios.post(`${API_BASE_URL}/solicitudes`, requestData);
      console.log('Datos enviados a la base de datos:', response.data);
      if (response.data.token) {
        setToken(response.data.token);
        setShowToken(true);
      } else {
        Swal.fire('Error', 'No se pudo generar el token', 'error');
      }
    } catch (err) {
      console.error('Error al enviar la solicitud:', err);
      Swal.fire('Error', 'No se pudo enviar la solicitud. Revisa la consola para más detalles.', 'error');
    }
  };
  

  const resetHelpRequest = () => {
    setShowDescriptionField(false);
    setPatente('');
    setDescription('');
    setPhoto(null);
    setError('');
    setToken('');
    setShowToken(false);
    setLatitud(null); // Reiniciar latitud
    setLongitud(null); // Reiniciar longitud
  };

  return (
    <div className='help-request-container'>
      {!showToken && !showDescriptionField && !photo && (
        <div className="text-field-container">
          <label htmlFor="patente">Ingrese la patente del vehículo:</label>
          <input
            type="text"
            id="patente"
            className="help-text-field"
            value={patente}
            onChange={(e) => setPatente(e.target.value)}
          />
          {error && <p className="error-message">{error}</p>}
          <button className='help-button' onClick={handleHelpRequest}>
            Pedir por servicio de acarreo
          </button>
        </div>
      )}

      {showDescriptionField && !photo && (
        <div className='text-field-container'>
          <label htmlFor="description">Descripción del problema:</label>
          <textarea
            id="description"
            className="help-text-field"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className='send-button' onClick={handleSendDescription}>
            Enviar
          </button>
        </div>
      )}

      {photo && (
        <div className='photo-preview'>
          <h3>Foto seleccionada:</h3>
          <img src={photo} alt="Selected" style={{ width: '100%', maxHeight: '300px' }} />
          <button className='send-button' onClick={handleSendPhoto}>
            Enviar foto
          </button>
        </div>
      )}

      {showToken && (
        <div className='token-display'>
          <h3>Tu token generado:</h3>
          <p>{token}</p>
          <button className='finish-button' onClick={resetHelpRequest}>
            Finalizar
          </button>
        </div>
      )}

      <input
        type="file"
        id="photoInput"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handlePhotoUpload}
      />
    </div>
  );
};

export default HelpRequest;
