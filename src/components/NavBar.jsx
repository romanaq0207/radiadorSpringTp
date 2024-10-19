import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWarehouse } from '@fortawesome/free-solid-svg-icons';
import {
  faHome, faCar, faWrench, faUsers, faRoute, faBox,
  faCogs, faChartLine, faMoneyBillWave, faUserShield
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
            <FontAwesomeIcon icon={faHome} /> {/* Icono de "Inicio" */}
          </Link>
        </li>

        {/* Opciones solo para "administrador" */}
        {role === "administrador" && (
          <>
            <li className="navbar-item">
              <Link to="/gestion-autos" className="navbar-link" title="Búsqueda de Autos" onClick={closeMenu}>
                <FontAwesomeIcon icon={faCar} /> {/* Icono de "Búsqueda de Autos" */}
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/gestion-proveedores" className="navbar-link" title="Gestión de Proveedores" onClick={closeMenu}>
                 <FontAwesomeIcon icon={faWarehouse} />
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/gestion-mecanicos" className="navbar-link" title="Gestión de Mecánicos" onClick={closeMenu}>
                <FontAwesomeIcon icon={faWrench} /> {/* Icono de "Gestión de Mecánicos" */}
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/gestion-conductor" className="navbar-link" title="Gestión de Conductores" onClick={closeMenu}>
                <FontAwesomeIcon icon={faRoute} /> {/* Icono de "Gestión de Conductores" */}
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/reportes" className="navbar-link" title="Reportes" onClick={closeMenu}>
                <FontAwesomeIcon icon={faChartLine} /> {/* Icono de "Reportes" */}
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/admin-gastos" className="navbar-link" title="Administración de Gastos" onClick={closeMenu}>
                <FontAwesomeIcon icon={faMoneyBillWave} /> {/* Icono de "Administración de Gastos" */}
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/admin-usuarios" className="navbar-link" title="Administración de Usuarios" onClick={closeMenu}>
                <FontAwesomeIcon icon={faUserShield} /> {/* Icono de "Administración de Usuarios" */}
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/admin-flotas" className="navbar-link" title="Administración de Flotas" onClick={closeMenu}>
                <FontAwesomeIcon icon={faWarehouse} /> {/* Icono de "Administración de Flotas" */}
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/productos" className="navbar-link" title="Productos" onClick={closeMenu}>
                <FontAwesomeIcon icon={faBox} /> {/* Icono de "Productos" */}
              </Link>
            </li>
          </>
        )}

        {/* Puedes continuar agregando más roles e íconos para cada opción */}
      </ul>
    </nav>
  );
}

export default Navbar;
