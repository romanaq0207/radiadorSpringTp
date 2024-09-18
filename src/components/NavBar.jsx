import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

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
            {/* Botón Hamburguesa */}
            <div className="navbar-toggle" onClick={toggleMenu}>
                <span></span>
                <span></span>
                <span></span>
            </div>

            {/* Lista de Navegación */}
            <ul className={`navbar-list ${isOpen ? 'navbar-list-open' : ''}`}>
                <li className="navbar-item">
                    <Link to="/" className="navbar-link" onClick={closeMenu}>Inicio</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/gestion-autos" className="navbar-link" onClick={closeMenu}>Búsqueda de Autos</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/gestion-mecanicos" className="navbar-link" onClick={closeMenu}>Gestión de Mecánicos</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
