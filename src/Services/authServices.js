// authServices.js
import axios from "axios";
import { API_BASE_URL } from "../assets/config";

export const login = async (email, password) => {
  try {
    console.log("Datos enviados al servidor:", { email, password });
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email,
      password,
    }, { withCredentials: true }); // Importante: withCredentials: true para enviar cookies

    if (response.status === 200) {
      const { user, role } = response.data;
      localStorage.setItem("user", JSON.stringify(user)); // Guardar datos del usuario
      console.log(role);
      localStorage.setItem("role", role); 
      return { success: true, user, role };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    console.error("Error en el login:", error);
    return { success: false, message: "Error de autenticación" };
  }
};