// src/main.jsx

/**
 * TUTOR: Punto de entrada de la aplicación.
 * Aquí importamos Bootstrap para que sus estilos estén disponibles globalmente.
 * Envolvemos toda la App en <BrowserRouter> para habilitar la navegación entre páginas.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

// 1. Importamos los estilos de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// 2. (Opcional) Puedes crear un index.css para estilos globales personalizados
import './index.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);