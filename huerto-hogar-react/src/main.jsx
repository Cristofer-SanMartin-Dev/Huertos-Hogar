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

// Importamos los Contextos (Estado global)
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Importamos los estilos
import 'bootstrap/dist/css/bootstrap.min.css';
// 2. (Opcional) Puedes crear un index.css para estilos globales personalizados
import './index.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* AuthProvider envuelve a CartProvider, y este a la App */}
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);