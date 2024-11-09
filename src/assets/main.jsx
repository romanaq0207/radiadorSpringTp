import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Importa BrowserRouter
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router> {/* Envuelve App en Router */}
      <App />
    </Router>
  </StrictMode>
);