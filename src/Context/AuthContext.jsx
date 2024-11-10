/*// AuthContext.jsx
import React, { useState, useEffect } from "react";
import { login as loginService } from "../Services/authServices";

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [login, setLogin] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay una sesión activa al cargar la app
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedRole = localStorage.getItem("role");

    if (storedUser && storedRole) {
      setLogin(true);
      setRole(storedRole);
    }
    setLoading(false);
  }, []);

  const handleLogin = async (email, password) => {
    setLoading(true);
    const result = await loginService(email, password);
    if (result.success) {
      setLogin(true);
      setRole(result.role);
    } else {
      console.error(result.message);
      setLogin(false);
      setRole(null);
    }
    setLoading(false);
  };

  /*const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setLogin(false);
    setRole(null);
    // Opción: hacer una llamada al servidor para cerrar sesión, si se necesita
  };
  const handleLogout = async () => {
    const sessionId = localStorage.getItem("session_id"); // Obtener el session_id del localStorage
    
    try {
      // Si el sessionId existe, hacer la llamada a la API de logout
      if (sessionId) {
        await axios.post("http://localhost:5000/api/logout", { sessionId });
      }
  
      // Limpiar el localStorage y las variables de estado
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("session_id"); // Eliminar también el session_id
  
      // Establecer el estado de login como falso
      setLogin(false);
      setRole(null);
  
      // Redirigir a la página de login o home después del logout
      navigate("/");  // O usa navigate("/") si quieres ir a home
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Maneja el error si algo falla
    }
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ login, role, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
*/
import React, { useState, useEffect } from "react";
import { login as loginService } from "../Services/authServices";
import { useNavigate } from "react-router-dom";  // Importa useNavigate

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [login, setLogin] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Usa el hook useNavigate aquí

  useEffect(() => {
    // Verificar si hay una sesión activa al cargar la app
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedRole = localStorage.getItem("role");

    if (storedUser && storedRole) {
      setLogin(true);
      setRole(storedRole);
    }
    setLoading(false);
  }, []);

  const handleLogin = async (email, password) => {
    setLoading(true);
    const result = await loginService(email, password);
    if (result.success) {
      setLogin(true);
      setRole(result.role);
    } else {
      console.error(result.message);
      setLogin(false);
      setRole(null);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    
      setLogin(false);
      localStorage.removeItem("user"); // Elimina el usuario del localStorage
      localStorage.removeItem("role"); // Elimina el rol del localStorage
      setRole(null); // Resetea el rol al cerrar sesión
      window.location.reload(); // Recarga la página
    };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ login, role, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
