<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
// 1. Importa el AuthProvider
import { AuthProvider } from './context/AuthContext';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* 2. Envuelve la app con AuthProvider */}
      {/* Es buena idea que AuthProvider envuelva a CartProvider si el carrito depende del usuario */}
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
=======
=======
>>>>>>> af2fc13 (Extructura base)
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
<<<<<<< HEAD
>>>>>>> af2fc13 (Extructura base)
=======
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
// 1. Importa el AuthProvider
import { AuthProvider } from './context/AuthContext';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* 2. Envuelve la app con AuthProvider */}
      {/* Es buena idea que AuthProvider envuelva a CartProvider si el carrito depende del usuario */}
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
>>>>>>> f624ce9 (Configuración Inicial, Estructura y Layout Principal)
=======
>>>>>>> af2fc13 (Extructura base)
