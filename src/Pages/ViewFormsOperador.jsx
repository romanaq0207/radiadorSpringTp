import React, { useState } from 'react';
import styles from './ViewFormsOperador.module.css';

// Datos de ejemplo (conductor es el mismo en cada registro)
const formData = [
  {
    fechaHora: "2024-10-30 14:35:29",
    usuarioConductor: "Juan Pérez",
    usuarioMecanico: "Carlos Ramírez",
    coordenadas: {
      longitud: "-99.1332",
      latitud: "19.4326"
    },
    stockUtilizado: "Filtro de aceite",
    descripcion: "Cambio de filtro debido a desgaste."
  },
  {
    fechaHora: "2024-10-30 15:42:10",
    usuarioConductor: "Juan Pérez",
    usuarioMecanico: "Luis Fernández",
    coordenadas: {
      longitud: "-99.1234",
      latitud: "19.4321"
    },
    stockUtilizado: "Aceite de motor",
    descripcion: "Se recargó aceite debido a bajo nivel."
  },
  {
    fechaHora: "2024-10-30 16:50:05",
    usuarioConductor: "Juan Pérez",
    usuarioMecanico: "José López",
    coordenadas: {
      longitud: "-99.1456",
      latitud: "19.4333"
    },
    stockUtilizado: "Refrigerante",
    descripcion: "Reemplazo de refrigerante por fuga."
  }
];

const ViewFormsOperador = () => {
  const [formStates, setFormStates] = useState(
    formData.map(() => ({ aprobado: null })) // Estado inicial de cada formulario
  );

  const handleConfirm = (index) => {
    const newFormStates = [...formStates];
    newFormStates[index].aprobado = true; // Marcar como aprobado
    setFormStates(newFormStates);
  };

  const handleDeny = (index) => {
    const newFormStates = [...formStates];
    newFormStates[index].aprobado = false; // Marcar como denegado
    setFormStates(newFormStates);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Revisión de formularios</h2>
      {formData.map((form, index) => (
        <div key={index} className={styles.card}>
          <p><strong>Fecha y Hora:</strong> {form.fechaHora}</p>
          <p><strong>Usuario Conductor:</strong> {form.usuarioConductor}</p>
          <p><strong>Usuario Mecánico:</strong> {form.usuarioMecanico}</p>
          <p><strong>Coordenadas:</strong> Longitud {form.coordenadas.longitud}, Latitud {form.coordenadas.latitud}</p>
          <p><strong>Stock Utilizado:</strong> {form.stockUtilizado}</p>
          <p><strong>Descripción:</strong> {form.descripcion}</p>
          <div className={styles.buttonContainer}>
            <button 
              onClick={() => handleConfirm(index)} 
              disabled={formStates[index].aprobado !== null}
            >
              Confirmar
            </button>
            <button 
              onClick={() => handleDeny(index)} 
              disabled={formStates[index].aprobado !== null}
            >
              Denegar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewFormsOperador;
