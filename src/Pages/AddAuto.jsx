import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';  // Biblioteca para generar QR
import { toPng } from 'html-to-image'; // Para convertir a imagen y descargar
import './AddAuto.css';
import { API_BASE_URL } from '../assets/config'; 

function AddAuto() {
    const [autoData, setAutoData] = useState({
        marca: '',
        modelo: '',
        anio: '',
        kilometraje: '',
        nro_patente: '',
        nro_flota: '', 
    });
    const [qrCodeValue, setQrCodeValue] = useState('');
    const qrRef = useRef(null); // Usado para referenciar el QRCode
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAutoData({ ...autoData, [name]: value });
    };

    const handleAddAuto = () => {
        // Validaciones
        const marcaRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/; // Solo letras y espacios
        const modeloRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/; // Letras, números y espacios
        const patenteRegex = /^([a-zA-Z]{3}\d{3}|[a-zA-Z]{2}\d{3}[a-zA-Z]{2})$/; // ABC123 o AB123CD

        if (!marcaRegex.test(autoData.marca)) {
            alert('La marca solo puede contener letras y espacios.');
            return;
        }

        if (!modeloRegex.test(autoData.modelo)) {
            alert('El modelo solo puede contener letras, números y espacios.');
            return;
        }

        if (!patenteRegex.test(autoData.nro_patente)) {
            alert('El número de patente debe seguir el formato ABC123 o AB123CD.');
            return;
        }

        // Enviar los datos del auto al servidor
        axios.post(`${API_BASE_URL}/autos`, {
            ...autoData,
            codigo_qr: ''  // El backend no necesita este campo, se generará en el frontend
        })
        .then(response => {
            console.log('Auto agregado:', response.data);
            const autoId = response.data.id; // Obtén el ID del nuevo auto
            const qrUrl = `${API_BASE_URL}/autos/${autoId}`; // Genera la URL del QR
            setQrCodeValue(qrUrl); // Asigna la URL como valor del QR
        })
        .catch(error => {
            console.error('Error al agregar auto:', error);
        });
    };

    const handleDownloadQR = () => {
        if (qrRef.current) {
            toPng(qrRef.current)
                .then((dataUrl) => {
                    const link = document.createElement('a');
                    link.href = dataUrl;
                    link.download = `${autoData.nro_patente}-qr-code.png`;
                    link.click();
                }
            )
                .catch((error) => {
                    console.error('Error al generar la imagen QR:', error);
                });
        }
    };

    return (
        <div className="add-auto">
            <h2>Agregar Nuevo Auto</h2>
            <input
                type="text"
                name="marca"
                placeholder="Marca"
                value={autoData.marca}
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="modelo"
                placeholder="Modelo"
                value={autoData.modelo}
                onChange={handleInputChange}
            />
            <input
                type="number"
                name="anio"
                placeholder="Año"
                value={autoData.anio}
                onChange={handleInputChange}
            />
            <input
                type="number"
                name="kilometraje"
                placeholder="Kilometraje"
                value={autoData.kilometraje}
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="nro_patente"
                placeholder="Número de Patente"
                value={autoData.nro_patente}
                onChange={handleInputChange}
            />
            {/* Campo para el número de flota */}
            <input
                type="text"
                name="nro_flota"
                placeholder="Número de Flota"
                value={autoData.nro_flota}
                onChange={handleInputChange}
            />
            <button onClick={handleAddAuto}>Agregar Auto</button>

            {/* Generar el código QR basado en la URL del auto */}
            {qrCodeValue && (
                <div>
                    <div ref={qrRef}>
                        <QRCode value={qrCodeValue} 
                           size={256} // Ajusta el tamaño del QR
                           bgColor="white" // Fondo blanco alrededor del QR
                           fgColor="black" // Color del QR
                           level="H" // Nivel de corrección de errores
                           />
                    </div>
                    <button onClick={handleDownloadQR}>Descargar QR como imagen</button>
                </div>
            )}
        </div>
    );
}

export default AddAuto;
