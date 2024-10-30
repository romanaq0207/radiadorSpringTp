import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome, faCar, faWrench, faUsers, faRoute, faBox, faCarOn,
  faChartLine, faMoneyBillWave, faUserShield, faWarehouse, faDolly, faClipboard, faRoad, faFire
} from '@fortawesome/free-solid-svg-icons';
import "./Navbar.css";
import { AuthContext } from "../Context/AuthContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { role } = useContext(AuthContext);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      {/* Botón Hamburguesa */}
      <div className="navbar-toggle" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Lista de Navegación */}
      <ul className={`navbar-list ${isOpen ? "navbar-list-open" : ""}`}>
        {/* Opciones comunes a todos */}
        <li className="navbar-item">
          <Link to="/" className="navbar-link" title="Inicio" onClick={closeMenu}>
            <FontAwesomeIcon icon={faHome} />
          </Link>
        </li>

        {/* Opciones solo para "administrador" */}
        {role === "administrador" && (
          <>
            <li className="navbar-item">
              <Link to="/gestion-autos" className="navbar-link" title="Búsqueda de Autos" onClick={closeMenu}>
                <FontAwesomeIcon icon={faCar} />
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/gestion-proveedores" className="navbar-link" title="Gestión de Proveedores" onClick={closeMenu}>
                <FontAwesomeIcon icon={faDolly} />
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/gestion-mecanicos" className="navbar-link" title="Gestión de Mecánicos" onClick={closeMenu}>
                <FontAwesomeIcon icon={faWrench} />
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/gestion-conductor" className="navbar-link" title="Gestión de Conductores" onClick={closeMenu}>
                <FontAwesomeIcon icon={faRoute} />
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/reportes" className="navbar-link" title="Reportes" onClick={closeMenu}>
                <FontAwesomeIcon icon={faChartLine} />
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/admin-gastos" className="navbar-link" title="Administración de Gastos" onClick={closeMenu}>
                <FontAwesomeIcon icon={faMoneyBillWave} />
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/admin-usuarios" className="navbar-link" title="Administración de Usuarios" onClick={closeMenu}>
                <FontAwesomeIcon icon={faUserShield} />
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/admin-flotas" className="navbar-link" title="Administración de Flotas" onClick={closeMenu}>
                <FontAwesomeIcon icon={faWarehouse} />
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/productos" className="navbar-link" title="Productos" onClick={closeMenu}>
                <FontAwesomeIcon icon={faBox} />
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/orden-de-compra" className="navbar-link" title="Órdenes de Compra" onClick={closeMenu}>
                <FontAwesomeIcon icon={faClipboard} />
              </Link>
            </li>
          </>
        )}

        {/* Opciones solo para "operador" */}
        {role === "operador" && (
          <>
            <li className="navbar-item">
              <Link to="/ver-mi-ruta" className="navbar-link" title="Visualizar Ruta" onClick={closeMenu}>
                <FontAwesomeIcon icon={faRoad} />
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/mis-gastos" className="navbar-link" title="Mis Gastos" onClick={closeMenu}>
                <FontAwesomeIcon icon={faMoneyBillWave} />
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/pedir-socorro" className="navbar-link" title="Pedir Socorro" onClick={closeMenu}>
                <FontAwesomeIcon icon={faFire} style={{color: "#ffffff",}} />
              </Link>
            </li>
          </>
        )}

        {/* Opciones solo para "gerente" */}
        {role === "gerente" && (
          <>
            <li className="navbar-item">
              <Link to="/verificar-rutas" className="navbar-link" title="Verificación de Rutas" onClick={closeMenu}>
               <FontAwesomeIcon icon={faRoad} />
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/reportes-gerencia" className="navbar-link" title="Reportes" onClick={closeMenu}>
                <FontAwesomeIcon icon={faChartLine} />
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/ver-gastos" className="navbar-link" title="Visualizador de Gastos" onClick={closeMenu}>
               <FontAwesomeIcon icon={faMoneyBillWave} />
              </Link>
            </li>
          </>
        )}

        {/* Opciones solo para "supervisor" */}
        {role === "supervisor" && (
          <>
            <li className="navbar-item">
              <Link to="/crear-ruta" className="navbar-link" title="Crear Ruta" onClick={closeMenu}>
                <FontAwesomeIcon icon={faRoad} />
              </Link>
            </li>
          </>
        )}

        {/* Opciones solo para "mecanico" */}
        {role === "mecanico" && (
          <>
            <li className="navbar-item">
              <Link to="/busqueda-auto-mecanico" className="navbar-link" title="Vehiculos de Operadores" onClick={closeMenu}>
               <FontAwesomeIcon icon={faCarOn} />
              </Link>
            </li>
          </>
        )}

        {/* Opciones solo para "cliente" */}
        {role === "cliente" && (
          <>
            <li className="navbar-item">
              <Link to="/visor-gastos" className="navbar-link" title="Visor de Gastos" onClick={closeMenu}>
                <FontAwesomeIcon icon={faMoneyBillWave} />
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/visor-flota" className="navbar-link" title="Visor de Flotas" onClick={closeMenu}>
                <FontAwesomeIcon icon={faWarehouse} />
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/reportes" className="navbar-link" title="Reportes" onClick={closeMenu}>
                <FontAwesomeIcon icon={faChartLine} />
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
