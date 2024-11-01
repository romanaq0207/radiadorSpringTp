import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './HelpRequest.css';

const HelpRequest = () => {
  const [showDescriptionField, setShowDescriptionField] = useState(false);
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [patente, setPatente] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const patenteRegex = /^([a-zA-Z]{3}\d{3}|[a-zA-Z]{2}\d{3}[a-zA-Z]{2})$/;

  const handleHelpRequest = () => {
    if (!patenteRegex.test(patente)) {
      setError('La patente debe ser en formato ABC123 o AB123CD');
      return;
    }
    setError('');
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
        setShowDescriptionField(true); // Muestra el campo de descripción
      }
    });
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
        setShowDescriptionField(false); // Oculta el campo de descripción
        document.getElementById('photoInput').click(); // Simula el clic en el input de archivo
      } else {
        navigate('/'); // Redirige al home
      }
    });
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result); // Guarda la imagen
      };
      reader.readAsDataURL(file); // Convierte el archivo a una URL de imagen
    }
  };

  const handleSendPhoto = () => {
    console.log('Foto enviada:', photo);
    setPhoto(null); // Limpiar la foto después de enviar
    Swal.fire('Enviado', 'Tu foto ha sido enviada con éxito', 'success');
    navigate('/'); // Redirige al home
  };

  return (
    <div className='help-request-container'>
      {!showDescriptionField && !photo && (
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
