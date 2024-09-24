import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
    
      <div className="navbar-toggle" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>


      <ul className={`navbar-list ${isOpen ? "navbar-list-open" : ""}`}>
        <li className="navbar-item">
          <Link to="/" className="navbar-link" onClick={closeMenu}>
            Inicio
          </Link>
        </li>
        <li className="navbar-item">
          <Link to="/gestion-autos" className="navbar-link" onClick={closeMenu}>
            Búsqueda de Autos
          </Link>
        </li>
        <li className="navbar-item">
          <Link
            to="/gestion-mecanicos"
            className="navbar-link"
            onClick={closeMenu}
          >
            Gestión de Mecánicos
          </Link>
        </li>
        <li className="navbar-item">
          <Link
            to="/gestion-conductor"
            className="navbar-link"
            onClick={closeMenu}
          >
            Gestión de Conductores
          </Link>
        </li>
        <li className="navbar.item">
          <Link to="/ver-mi-ruta" className="navbar-link" onClick={closeMenu}>
            Mi Ruta
          </Link>
        </li>
        <li className="navbar.item">
          <Link to="/mis-gastos" className="navbar-link" onAbort={closeMenu}>
            Mis Gastos
          </Link>
        </li>
        <li className="navbar.item">
          <Link to="/reportes" className="navbar-link" onAbort={closeMenu}>
            Reportes
          </Link>
        </li>
        <li className="navbar.item">
          <Link to="/admin-gastos" className="navbar-link" onAbort={closeMenu}>
            Administración de Gastos
          </Link>
        </li>
        <li className="navbar.item">
          <Link to="/admin-usuarios" className="navbar-link" onAbort={closeMenu}>
            Administración de Usuarios
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

