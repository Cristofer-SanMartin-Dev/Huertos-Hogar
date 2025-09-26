import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Importamos los estilos de Bootstrap para que estén disponibles en toda la app
import 'bootstrap/dist/css/bootstrap.min.css';

// Importamos nuestro proveedor de contexto del carrito
import { CartProvider } from './context/CartContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  // Envolvemos el componente principal <App /> con nuestro CartProvider.
  // Esto hace que el 'estado' del carrito (la lista de productos, la función para añadir, etc.)
  // esté disponible para cualquier componente dentro de App.
  <CartProvider>
    <App />
  </CartProvider>
);