import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket} from '@fortawesome/free-solid-svg-icons';
import './Home.css';

const Home = ({ onLogout }) => {
  return (
    <div className='conenido'>
    <div className='textos'>
      <h2>Bienvenido! </h2>
      <p>Gestiona tu taller desde tu dispositivo!</p>
      </div>
      <div>
      <button onClick={onLogout}><FontAwesomeIcon icon={faRightToBracket} /></button>
    </div>
    </div>
  );
};

export default Home;
