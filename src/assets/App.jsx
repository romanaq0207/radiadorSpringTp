import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AutoSearch from '../Pages/AutoSearch';
import AutoDetail from '../Pages/AutoDetail';
import MechanicManagement from '../Pages/MechanicManagement';
import Navbar from '../components/NavBar';
import AddAuto from '../Pages/AddAuto';
import QRScanner from '../Pages/QRScanner';
import Home from '../Pages/Home';
import Login from '../Pages/Login';
import AddMechanic from '../Pages/AddMechanic'

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
    const handleLogin = () => {
      setIsAuthenticated(true); // Cambiar el estado de autenticación a verdadero cuando el usuario inicie sesión
    };
  
    const handleLogout = () => {
      setIsAuthenticated(false); // Cambiar el estado de autenticación a falso cuando el usuario cierre sesión
    };

  return (
    <div className="App">
      <main>
        <Router>
        {isAuthenticated && <Navbar />}
          <Routes>
            <Route path="/" element={isAuthenticated ? <Home onLogout={handleLogout} /> : <Login onLogin={handleLogin} />} />
            <Route path="/gestion-autos" element={<AutoSearch />} />
            <Route path="/autos/:id" element={<AutoDetail />} />
            <Route path="/gestion-mecanicos" element={<MechanicManagement />} />
            <Route path="/agregar-auto" element={ <AddAuto /> } />
            <Route path="/escanear-qr" element={<QRScanner />} />
            //<Route path="/agregar-mecanico" element={ <AddMechanic /> } />           
          </Routes>
        </Router>
      </main>
    </div>
  );
}

export default App;
