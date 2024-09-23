import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import gastosData from '../data/gastos.json'; // Ajusta la ruta según tu estructura
import './BillsManagement.css'; 

const BillsManagement = () => {
  const [gastos, setGastos] = useState([]);
  const [filteredGastos, setFilteredGastos] = useState([]);
  const [filterDescription, setFilterDescription] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar los datos del archivo JSON
    setGastos(gastosData);
    setFilteredGastos(gastosData);
  }, []);

  // Filtrar gastos por descripción y estado
  useEffect(() => {
    let filtered = gastos.filter(gasto =>
      gasto.descripcion.toLowerCase().includes(filterDescription.toLowerCase()) &&
      (filterEstado === '' || gasto.estado === filterEstado)
    );
    setFilteredGastos(filtered);
  }, [filterDescription, filterEstado, gastos]);

  const handleMarkAsPaid = (id) => {
    setGastos(gastos.map((gasto) =>
      gasto.id === id ? { ...gasto, estado: 'Pagado' } : gasto
    ));
  };

  //const handlePay = (id) => {
  //  navigate(`/pagar-gasto/${id}`); // Redirige a la pantalla de pago
  //};

  return (
    <div className="expenses-management-container">
      <h2 className="title">Gestión de Gastos</h2>

      {/* Filtros */}
      <div className="filters">
        <input
          type="text"
          placeholder="Filtrar por descripción"
          value={filterDescription}
          onChange={(e) => setFilterDescription(e.target.value)}
        />
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Pagado">Pagado</option>
        </select>
      </div>

      {/* Lista de gastos */}
      <div className="expenses-list">
        {filteredGastos.map((gasto) => (
          <div key={gasto.id} className="expense-card">
            <p><strong>Descripción:</strong> {gasto.descripcion}</p>
            <p><strong>Monto:</strong> ${gasto.monto}</p>
            <p><strong>Estado:</strong> {gasto.estado}</p>

            {/* Botón "Marcar como pago", deshabilitado si ya está pagado */}
            <button
              onClick={() => handleMarkAsPaid(gasto.id)}
              disabled={gasto.estado === 'Pagado'}
              className="mark-paid-button"
            >
              {gasto.estado === 'Pagado' ? 'Pagado' : 'Marcar como pago'}
            </button>

            {/* Botón "Pagar", deshabilitado si ya está pagado */}
            <button
              //onClick={() => handlePay(gasto.id)}
              disabled={gasto.estado === 'Pagado'}
              className="pay-button"
            >
              Pagar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillsManagement;
