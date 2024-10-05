import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { AuthContext } from "../Context/AuthContext"; // Asegúrate de importar tu contexto de autenticación

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { role } = useContext(AuthContext); // Obtén el rol del usuario desde el contexto

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
          <Link to="/" className="navbar-link" onClick={closeMenu}>
            Inicio
          </Link>
        </li>
        <li className="navbar-item">
              <Link
                to="/visor-gastos"
                className="navbar-link"
                onClick={closeMenu}
              >
                Visor de Gastos
              </Link>
            </li>
            <li className="navbar-item">
              <Link
                to="/visor-flota"
                className="navbar-link"
                onClick={closeMenu}
              >
                Visor de Flotas
              </Link>
            </li>

        {/* Opciones solo para "administrador" */}
        {role === "administrador" && (
          <>
            <li className="navbar-item">
              <Link
                to="/gestion-autos"
                className="navbar-link"
                onClick={closeMenu}
              >
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
            <li className="navbar-item">
              <Link to="/reportes" className="navbar-link" onClick={closeMenu}>
                Reportes
              </Link>
            </li>
            <li className="navbar-item">
              <Link
                to="/admin-gastos"
                className="navbar-link"
                onClick={closeMenu}
              >
                Administración de Gastos
              </Link>
            </li>
            <li className="navbar-item">
              <Link
                to="/admin-usuarios"
                className="navbar-link"
                onClick={closeMenu}
              >
                Administración de Usuarios
              </Link>
            </li>
            <li className="navbar-item">
              <Link
                to="/admin-flotas"
                className="navbar-link"
                onClick={closeMenu}
              >
                Administración de Flotas
              </Link>
            </li>
          </>
        )}

        {/* Opciones solo para "operador" */}
        {role === "operador" && (
          <>
            <li className="navbar-item">
              <Link
                to="/ver-mi-ruta"
                className="navbar-link"
                onClick={closeMenu}
              >
                Mi Posicion
              </Link>
            </li>
            <li className="navbar-item">
              <Link
                to="/mis-gastos"
                className="navbar-link"
                onClick={closeMenu}
              >
                Mis Gasto
              </Link>
            </li>
            <li className="navbar-item">
              <Link
                to="/ver-gastos"
                className="navbar-link"
                onClick={closeMenu}
              >
                Gastos
              </Link>
            </li>

            {/* cambair a interfaz gerente */}
            <li className="navbar-item">
              <Link
                to="/verificar-rutas"
                className="navbar-link"
                onClick={closeMenu}
              >
                Rutas
              </Link>
            </li>
            {/* cambair a interfaz gerente */}
            <li className="navbar-item">
              <Link
                to="/reportes-gerencia"
                className="navbar-link"
                onClick={closeMenu}
              >
                Reportes
              </Link>
            </li>

            {/* cambair a interfaz supervisor */}
            <li className="navbar-item">
              <Link
                to="/crear-ruta"
                className="navbar-link"
                onClick={closeMenu}
              >
                Crear Ruta
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
