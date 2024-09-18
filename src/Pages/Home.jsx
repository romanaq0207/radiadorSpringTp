import React from 'react';
import './Home.css';

const Home = ({ onLogout }) => {
  return (
    <div className='conenido'>
    <div className='textos'>
      <h2>Bienvenido! </h2>
      <p>Gestiona tu taller desde tu dispositivo!</p>
      </div>
      <div>
      <button onClick={onLogout}>Cerrar sesión</button>
    </div>
    </div>
  );
};

export default Home;
