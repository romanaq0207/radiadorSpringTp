import React, { useState } from 'react';
import Swal from 'sweetalert2';
import styles from './ViewFormsSupervisor.module.css';

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

const ViewFormsSupervisor = () => {
  const [formStates, setFormStates] = useState(
    formData.map(() => ({ aprobado: null })) // Estado inicial de cada formulario
  );

  const handleConfirm = (index) => {
    Swal.fire({
      title: '¿Estás seguro de querer confirmar el formulario?',
      text: "Se descontarán del stock los productos utilizados.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const newFormStates = [...formStates];
        newFormStates[index].aprobado = true; // Marcar como aprobado
        setFormStates(newFormStates);
        Swal.fire(
          'Confirmado',
          'El formulario ha sido confirmado y se descontarán los productos del stock.',
          'success'
        );
      }
    });
  };

  const handleDeny = (index) => {
    Swal.fire({
      title: '¿Estás seguro de querer rechazar el formulario?',
      text: "Los elementos utilizados en el formulario no se descontarán del stock.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const newFormStates = [...formStates];
        newFormStates[index].aprobado = false; // Marcar como denegado
        setFormStates(newFormStates);
        Swal.fire(
          'Rechazado',
          'El formulario ha sido rechazado y los productos no se descontarán del stock.',
          'success'
        );
      }
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Revisión de formularios</h2>
      {formData.map((form, index) => (
        <div key={index} className={styles.card}>
          <p><strong>Fecha y Hora:</strong> {form.fechaHora}</p>
          <p><strong>Usuario Conductor:</strong> {form.usuarioConductor}</p>
          <p><strong>Usuario Mecánico:</strong> {form.usuarioMecanico}</p>
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

export default ViewFormsSupervisor;
