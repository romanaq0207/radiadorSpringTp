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
//import { AuthProvider, useAuth } from '../Context/AuthContext';
import BillStates from "../Pages/BillsStates";
import RoutesVerify from "../Pages/RoutesVerify";
import RouteViewVerify from "../Pages/RouteViewVerify";
import ReportManagement from "../Pages/ReportManagement";

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
      {login && <Navbar />}
      <main>
        <Routes>
          <Route
            path="/"
            element={login ? <Home onLogout={handleLogout} /> : <Login />}
          />
          <Route path="/gestion-autos" element={<AutoSearch />} />
          <Route path="/autos/:id" element={<AutoDetail />} />
          <Route path="/gestion-mecanicos" element={<MechanicManagement />} />
          <Route path="/agregar-auto" element={<AddAuto />} />
          <Route path="/escanear-qr" element={<QRScanner />} />
          <Route path="/agregar-mecanico" element={<AddMechanic />} />
          <Route path="/gestion-conductor" element={<DriversManagement />} />
          <Route path="/ver-mi-ruta" element={<MyRoute />} />
          <Route path="/mis-gastos" element={<MyBills />} />
          <Route path="/agregar-gastos" element={<AddBills />} />
          <Route path="/reportes" element={<Reports />} />
          <Route path="/admin-gastos" element={<BillsManagement />} />
          <Route path="/admin-usuarios" element={<UsersManagement />} />
          <Route path="/admin-flotas" element={<AddFlota />} />
          <Route path="/ver-gastos" element={<BillStates />} />
          <Route path="/verificar-rutas" element={<RoutesVerify />} />
          <Route path="/rutas/:id" element={<RouteViewVerify />} />
          <Route path="/reportes-gerencia" element={<ReportManagement />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
