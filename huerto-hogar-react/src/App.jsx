
// src/App.jsx
import { Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import CartPage from './pages/CartPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import BlogPage from './pages/BlogPage.jsx';
import ArticlePage from './pages/ArticlePage.jsx';

const Layout = () => (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
        <Header />
        <main className="flex-grow-1">
            <Outlet />
        </main>
        <Footer />
    </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="productos" element={<ProductsPage />} />
        <Route path="carrito" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:articleId" element={<ArticlePage />} />
        <Route
          path="perfil"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<div className="container text-center py-5"><h2 style={{ fontFamily: 'var(--font-header)', color: 'var(--accent-brown)' }}>404: Página no encontrada</h2></div>} />
      </Route>
    </Routes>
  );
}

export default App;

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// src/App.jsx

import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';

// 1. Importa el componente real de la página de inicio
import HomePage from './pages/HomePage';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
// 1. Importamos las nuevas páginas
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// TUTOR: Creamos un componente para proteger rutas.
// Si el usuario no está autenticado, lo redirige a la página de login.
// Si lo está, renderiza la página solicitada (el `children`).
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};


// Componente Layout para la estructura principal de la página

import { Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import CartPage from './pages/CartPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// TUTOR: Componente Layout para la estructura principal de la página (Header y Footer).
// <Outlet /> de react-router-dom renderizará aquí el componente de la página activa.
>>>>>>> 45ddfb7 ( Página de Perfil de Usuario (ProfilePage))
const Layout = () => (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
        <Header />
        <main className="flex-grow-1">
            <Outlet />
        </main>
        <Footer />
    </div>
);

// TUTOR: Componente principal de la aplicación que define todas las rutas.
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="productos" element={<ProductsPage />} />
        <Route path="carrito" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        
        {/* Ruta protegida para el perfil de usuario */}
        <Route
          path="perfil"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        
        {/* Ruta para manejar páginas no encontradas */}
        <Route path="*" element={<div className="container text-center py-5"><h2>404: Página no encontrada</h2></div>} />
      </Route>
    </Routes>
  );
}


export default App

// --- Componentes Placeholder para las Páginas ---
// (Los moveremos a sus propios archivos en los siguientes commits)
const HomePage = () => <div className="container text-center py-5"><h1>Página de Inicio</h1></div>;

// 3. Elimina el placeholder de HomePage que estaba aquí

const ProductsPage = () => <div className="container py-5"><h1>Catálogo de Productos</h1></div>;

export default App;

// 3. Elimina el placeholder de ProductsPage que estaba aquí
export default App;
>>>>>>> 11a3261 (Catálogo de Productos con Filtros (ProductsPage))
=======
export default App;
>>>>>>> 147913b (Estado Global del Carrito con Context API)
