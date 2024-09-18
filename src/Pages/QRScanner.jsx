import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import { useNavigate } from 'react-router-dom';

const QRScanner = () => {
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const navigate = useNavigate();

  const encenderCamara = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.hidden = false;
      }
      setStream(mediaStream);

      requestAnimationFrame(scan);
    } catch (err) {
      setError('Error al acceder a la cámara');
      console.error('Error al acceder a la cámara', err);
    }
  };

  const scan = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code) {
        console.log('QR Code detectado:', code.data);

        // Extraer solo la parte final del código QR para usar como ID
        const id = code.data.split('/').pop(); 

        // Redirigir a la página de detalles del auto
        navigate(`/autos/${id}`);
        cerrarCamara();
      }
    }

    requestAnimationFrame(scan);
  };

  const cerrarCamara = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.hidden = true;
    }
  };

  useEffect(() => {
    encenderCamara();

    return () => {
      cerrarCamara();
    };
  }, []);

  return (
    <div>
      {error && <p>{error}</p>}
      <video ref={videoRef} hidden autoPlay />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <button onClick={cerrarCamara}>Cerrar Cámara</button>
    </div>
  );
};

export default QRScanner;
