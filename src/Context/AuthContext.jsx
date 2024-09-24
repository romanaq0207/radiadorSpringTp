/*import React, { useState } from "react";

export const AuthContext = React.createContext();

//Crear provider
const AuthProvider = ({children})=>{ 
    const [login, setLogin] = useState(false);
    const handleLogin = ()=>
    { 
        setLogin(true)
    }
    const handleLogout = ()=>{
        setLogin(false)
    } 
    
    return(
    <AuthContext.Provider value={{login, handleLogin, handleLogout}}>{children}
    </AuthContext.Provider>);
    }
    export default AuthProvider

*/

import React, { useState, useEffect } from "react";
import firebase from "../firebase/credenciales"; // Asegúrate de que la ruta sea correcta

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => { 
    const [login, setLogin] = useState(false);
    const [role, setRole] = useState(null); // Estado para almacenar el rol

    const handleLogin = async () => { 
        setLogin(true);
        // Aquí obtén el usuario autenticado y su rol
        const user = firebase.auth().currentUser;
        if (user) {
            const userDoc = await firebase.firestore().collection('users').doc(user.uid).get(); // Cambia 'usuarios' por el nombre de tu colección
            if (userDoc.exists) {
                setRole(userDoc.data().rol); // Establece el rol en el estado
            }
        }
    };

    const handleLogout = () => {
        setLogin(false);
        setRole(null); // Resetea el rol al cerrar sesión
    }; 

    return (
        <AuthContext.Provider value={{ login, role, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
