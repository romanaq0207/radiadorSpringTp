import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './HelpRequest.css';

const HelpRequest = () => {
  const [showDescriptionField, setShowDescriptionField] = useState(false);
  const [description, setDescription] = useState('');
  const [showTokenField, setShowTokenField] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [helpMessage, setHelpMessage] = useState('');

  const handleHelpRequest = () => {
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
      cancelButtonText: 'No, continuar con TOKEN'
    }).then((result) => {
      if (result.isConfirmed) {
        document.getElementById('photoInput').click(); // Simula el clic en el input de archivo
      } else {
        setShowDescriptionField(false); // Oculta el campo de descripción
        setShowTokenField(true); // Muestra el campo de TOKEN
      }
    });
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result); // Guarda la imagen
        setShowDescriptionField(false); // Oculta el campo de descripción al seleccionar la foto
      };
      reader.readAsDataURL(file); // Convierte el archivo a una URL de imagen
    }
  };

  const handleSendPhoto = () => {
    console.log('Foto enviada:', photo);
    setPhoto(null); // Limpiar la foto después de enviar
    Swal.fire('Enviado', 'Tu foto ha sido enviada con éxito', 'success');

    setShowDescriptionField(false); // Oculta el campo de descripción
    setShowTokenField(true); // Muestra el campo de TOKEN
  };

  const handleSendMessage = () => {
    console.log('Descripción enviada:', description);
    setDescription(''); // Limpia el campo después de enviar
    Swal.fire('Enviado', 'Tu descripción ha sido enviada con éxito', 'success');

    setShowDescriptionField(false); // Oculta el campo de descripción
    setShowTokenField(true); // Muestra el campo de TOKEN
  };

  return (
    <div className='help-request-container'>
      {/* Solo mostrar el botón de ayuda si ni el campo de descripción, ni el de TOKEN, ni la foto están visibles */}
      {!showDescriptionField && !showTokenField && !photo && (
        <button className='help-button' onClick={handleHelpRequest}>
          Pedir por servicio de acarreo
        </button>
      )}
      {showDescriptionField && (
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
      {showTokenField && (
        <div className='text-field-container'>
          <label htmlFor="helpMessage">Ingrese el TOKEN:</label>
          <input
            type="text"
            id="helpMessage"
            className="help-text-field"
            value={helpMessage}
            onChange={(e) => setHelpMessage(e.target.value)}
          />
          <button className='send-button' onClick={handleSendMessage}>
            Enviar
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
