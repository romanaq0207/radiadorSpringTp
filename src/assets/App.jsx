import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AutoSearch from "../Pages/AutoSearch";
import AutoDetail from "../Pages/AutoDetail";
import MechanicManagement from "../Pages/MechanicManagement";
import Navbar from "../components/NavBar";
import AddAuto from "../Pages/AddAuto";
import QRScanner from "../Pages/QRScanner";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import AddMechanic from "../Pages/AddMechanic";
import DriversManagement from "../Pages/DriversManagement";
import MyRoute from "../Pages/MyRoute";
import MyBills from "../Pages/MyBills";
import AddBills from "../Pages/AddBills";
import Reports from "../Pages/Reports";
import BillsManagement from "../Pages/BillsManagement";
import UsersManagement from "../Pages/UsersManagement";
import AuthProvider, { AuthContext } from "../Context/AuthContext";
import AddFlota from "../Pages/AddFlota";
import BillStates from "../Pages/BillsStates";
import RoutesVerify from "../Pages/RoutesVerify";
import RouteViewVerify from "../Pages/RouteViewVerify";
import ReportManagement from "../Pages/ReportManagement";
import RouteCreate from "../Pages/RouteCreate";
import AutoAccidentRegister from "../Pages/AutoAccidentRegister";
import BillsViewer from "../Pages/BillsViewer";
import FlotaViewer from "../Pages/FlotaViewer";
import MechanicAutoSearch from "../Pages/MechanicAutoSearch";
import ProveedoresViewer from "../Pages/ProveedoresViewer";
import AddProveedor from "../Pages/AddProveedor";
import EditProveedor from "../Pages/EditProveedor";
import Products from "../Pages/Products";
import OrdenesDeCompra from "../Pages/OrdenesDeCompra";
import AddOrden from "../Pages/AddOrden";
import EditProducto from "../Pages/EditProducto";

const App = () => {
  // Mueve el useContext adentro del AuthProvider
  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <AuthConsumer />
        </Router>
      </div>
    </AuthProvider>
  );
};

const AuthConsumer = () => {
  const { login, handleLogout } = useContext(AuthContext); // Ahora funciona correctamente dentro de AuthProvider

  return (
    <>
      {login && <Navbar />} {/* Renderizar Navbar solo si está autenticado */}
      <main>
        <Routes>
          <Route
            path="/"
            element={login ? <Home onLogout={handleLogout} /> : <Login />}
          />
          <Route
            path="/gestion-autos"
            element={login ? <AutoSearch /> : <Login />}
          />
          <Route
            path="/autos/:id"
            element={login ? <AutoDetail /> : <Login />}
          />
          <Route
            path="/gestion-mecanicos"
            element={login ? <MechanicManagement /> : <Login />}
          />
          <Route
            path="/agregar-auto"
            element={login ? <AddAuto /> : <Login />}
          />
          <Route
            path="/escanear-qr"
            element={login ? <QRScanner /> : <Login />}
          />
          <Route
            path="/agregar-mecanico"
            element={login ? <AddMechanic /> : <Login />}
          />
          <Route
            path="/gestion-conductor"
            element={login ? <DriversManagement /> : <Login />}
          />
          <Route
            path="/ver-mi-ruta"
            element={login ? <MyRoute /> : <Login />}
          />
          <Route path="/mis-gastos" element={login ? <MyBills /> : <Login />} />
          <Route
            path="/agregar-gastos"
            element={login ? <AddBills /> : <Login />}
          />
          <Route path="/reportes" element={login ? <Reports /> : <Login />} />
          <Route
            path="/admin-gastos"
            element={login ? <BillsManagement /> : <Login />}
          />
          <Route
            path="/admin-usuarios"
            element={login ? <UsersManagement /> : <Login />}
          />
          <Route
            path="/admin-flotas"
            element={login ? <AddFlota /> : <Login />}
          />
          <Route
            path="/ver-gastos"
            element={login ? <BillStates /> : <Login />}
          />
          <Route
            path="/verificar-rutas"
            element={login ? <RoutesVerify /> : <Login />}
          />
          <Route
            path="/rutas/:id"
            element={login ? <RouteViewVerify /> : <Login />}
          />
          <Route
            path="/reportes-gerencia"
            element={login ? <ReportManagement /> : <Login />}
          />
          <Route
            path="/crear-ruta"
            element={login ? <RouteCreate /> : <Login />}
          />
          <Route
            path="/autos-accidentes/:id"
            element={login ? <AutoAccidentRegister /> : <Login />}
          />
          <Route
            path="/busqueda-auto-mecanico"
            element={login ? <MechanicAutoSearch /> : <Login />}
          />
          <Route
            path="/visor-gastos"
            element={login ? <BillsViewer /> : <Login />}
          />
          <Route
            path="/visor-flota"
            element={login ? <FlotaViewer /> : <Login />}
          />
          <Route
            path="/gestion-proveedores"
            element={login ? <ProveedoresViewer /> : <Login />}
          />
          <Route
            path="/agregar-proveedor"
            element={login ? <AddProveedor /> : <Login />}
          />
          <Route
            path="/orden-de-compra"
            element={login ? <OrdenesDeCompra /> : <Login />}
          />
          <Route
            path="/edit-proveedor/:id"
            element={login ? <EditProveedor /> : <Login />}
          />
          <Route path="/productos" element={login ? <Products /> : <Login />} />
          <Route
            path="/edit-producto/:id"
            element={login ? <EditProducto /> : <Login />}
          />
          <Route path="/add-orden" element={login ? <AddOrden /> : <Login />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
