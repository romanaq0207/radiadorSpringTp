import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { toPng } from 'html-to-image';
import './EditCar.css';
import { API_BASE_URL } from '../assets/config';

function EditCar() {
    const { id } = useParams();  // Obtén el ID del auto desde los parámetros de la URL
    const [autoData, setAutoData] = useState({
        marca: '',
        modelo: '',
        anio: '',
        kilometraje: '',
        nro_patente: '',
        nro_flota: '',
    });
    const [qrCodeValue, setQrCodeValue] = useState('');
    const qrRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_BASE_URL}/autos/${id}`)
            .then(response => setAutoData(response.data))
            .catch(error => console.error('Error al obtener los datos del auto:', error));
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAutoData({ ...autoData, [name]: value });
    };

    const handleUpdateAuto = () => {
        const marcaRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        const modeloRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/;
        const patenteRegex = /^([a-zA-Z]{3}\d{3}|[a-zA-Z]{2}\d{3}[a-zA-Z]{2})$/;

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

        axios.put(`${API_BASE_URL}/autos/${id}`, autoData)
            .then(() => {
                const qrUrl = `${API_BASE_URL}/autos/${id}`;
                setQrCodeValue(qrUrl);
                alert('Auto actualizado con éxito.');
                navigate('/autos');
            })
            .catch(error => console.error('Error al actualizar el auto:', error));
    };

    const handleDownloadQR = () => {
        if (qrRef.current) {
            toPng(qrRef.current)
                .then((dataUrl) => {
                    const link = document.createElement('a');
                    link.href = dataUrl;
                    link.download = `${autoData.nro_patente}-qr-code.png`;
                    link.click();
                })
                .catch((error) => console.error('Error al generar la imagen QR:', error));
        }
    };

    return (
        <div className="edit-car">
            <h2>Agregar Auto</h2>
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
            <input
                type="text"
                name="nro_flota"
                placeholder="Número de Flota"
                value={autoData.nro_flota}
                onChange={handleInputChange}
            />
            <button onClick={handleUpdateAuto}>Confirmar</button>

            {qrCodeValue && (
                <div>
                    <div ref={qrRef}>
                        <QRCode value={qrCodeValue} size={256} bgColor="white" fgColor="black" level="H" />
                    </div>
                    <button onClick={handleDownloadQR}>Descargar QR como imagen</button>
                </div>
            )}
        </div>
    );
}

export default EditCar;
