import "./Navbar.css";
import { useState, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { GiTowTruck } from "react-icons/gi";
import {
  FaHome,
  FaUser,
  FaCar,
  FaUserCog,
  FaChartLine,
  FaTools,
  FaUsers,
  FaTruck,
  FaBox,
  FaShoppingCart,
  FaRoute,
  FaFileInvoiceDollar,
  FaHandHoldingUsd,
  FaClipboardCheck,
  FaFileAlt,
} from "react-icons/fa";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { role } = useContext(AuthContext);
  const rol = localStorage.getItem("role");

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = useMemo(() => {
    const commonLinks = [
      { to: "/", title: "Inicio", icon: <FaHome /> },
      { to: "/mi-perfil", title: "Perfil", icon: <FaUser /> },
    ];

    const roleBasedLinks = {
      administrador: [
        {
          to: "/gestion-autos",
          title: "Búsqueda de Vehiculos",
          icon: <FaCar />,
        },
        {
          to: "/gestion-proveedores",
          title: "Proveedores",
          icon: <FaUserCog />,
        },
        { to: "/gestion-mecanicos", title: "Mecánicos", icon: <FaTools /> },
        { to: "/gestion-conductor", title: "Conductores", icon: <FaUsers /> },
        { to: "/reportes", title: "Reportes", icon: <FaChartLine /> },
        { to: "/admin-usuarios", title: "Usuarios", icon: <FaUserCog /> },
        { to: "/admin-flotas", title: "Flotas", icon: <FaTruck /> },
        { to: "/productos", title: "Productos", icon: <FaBox /> },
        {
          to: "/orden-de-compra",
          title: "Órdenes de Compra",
          icon: <FaShoppingCart />,
        },
      ],
      conductor: [
        { to: "/ver-mi-ruta", title: "Rutas", icon: <FaRoute /> },
        { to: "/pedir-acarreo", title: "Pedir Acarreo", icon: <GiTowTruck /> },
        {
          to: "/verificar-formularios",
          title: "Fichas de control",
          icon: <FaClipboardCheck />,
        },
      ],
      gerente: [
        {
          to: "/verificar-rutas",
          title: "Verificación de Rutas",
          icon: <FaRoute />,
        },
        { to: "/reportes-gerencia", title: "Reportes", icon: <FaChartLine /> },
        {
          to: "/ordenes-compras-gerente",
          title: "Ordenes de Compra",
          icon: <FaShoppingCart />,
        },
      ],
      supervisor: [
        { to: "/crear-ruta", title: "Crear Ruta", icon: <FaRoute /> },
        {
          to: "/formularios-supervisor",
          title: "Fichas de control",
          icon: <FaClipboardCheck />,
        },
        
      ],
      mecanico: [
        {
          to: "/busqueda-auto-mecanico",
          title: "Vehículos de Operadores",
          icon: <FaCar />,
        },
        {
          to: "/pedidos-ayuda",
          title: "Pedidos de Acarreo",
          icon: <GiTowTruck />,
        },
      ],
      cliente: [
        { to: "/visor-flota", title: "Visor de Flotas", icon: <FaTruck /> },
        { to: "/reportes", title: "Reportes", icon: <FaChartLine /> },
      ],
    };

    return [...commonLinks, ...(roleBasedLinks[rol] || [])];
  }, [rol]);

  return (
    <nav className="navbar">
      <div className="navbar-toggle" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={`navbar-list ${isOpen ? "navbar-list-open" : ""}`}>
        {navLinks.map((link, index) => (
          <li key={index} className="navbar-item">
            <Link
              to={link.to}
              className="navbar-link"
              title={link.title} // Tooltip para indicar el nombre del enlace
              onClick={closeMenu}
            >
              {link.icon}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
