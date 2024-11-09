// authServices.js
import axios from "axios";

export const login = async (email, password) => {
  try {
    console.log("Datos enviados al servidor:", { email, password });
    const response = await axios.post("http://localhost:5000/api/login", {
      email,
      password,
    }, { withCredentials: true }); // Importante: withCredentials: true para enviar cookies

    if (response.status === 200) {
      const { user, role } = response.data;
      localStorage.setItem("user", JSON.stringify(user)); // Guardar datos del usuario
      localStorage.setItem("role", role); 
      localStorage.setItem('sessionId', response.data.sessionId);// Guardar rol del usuario
      return { success: true, user, role };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    console.error("Error en el login:", error);
    return { success: false, message: "Error de autenticación" };
  }
};