<<<<<<< HEAD
<<<<<<< HEAD
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
=======
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
=======
// src/App.jsx
import { Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> f624ce9 (Configuración Inicial, Estructura y Layout Principal)
=======
// 1. Importa el componente real de la página de inicio
import HomePage from './pages/HomePage';
>>>>>>> 5473e38 (Construcción de la Página de Inicio (HomePage))
=======
import HomePage from './pages/HomePage';
// 1. Importa el componente real de la página de productos
import ProductsPage from './pages/ProductsPage';

>>>>>>> 11a3261 (Catálogo de Productos con Filtros (ProductsPage))

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
                {/* 2. La ruta ahora renderiza el componente ProductsPage con su lógica */}
                <Route path="productos" element={<ProductsPage />} />
                <Route path="carrito" element={<div>Página del Carrito</div>} />
                <Route path="login" element={<div>Página de Login</div>} />
                <Route path="register" element={<div>Página de Registro</div>} />
                <Route path="perfil" element={<div>Página de Perfil</div>} />
                <Route path="*" element={<div>Página no encontrada</div>} />
            </Route>
        </Routes>
    );
}

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
export default App
>>>>>>> af2fc13 (Extructura base)
=======
// --- Componentes Placeholder para las Páginas ---
// (Los moveremos a sus propios archivos en los siguientes commits)
const HomePage = () => <div className="container text-center py-5"><h1>Página de Inicio</h1></div>;
=======
// 3. Elimina el placeholder de HomePage que estaba aquí
>>>>>>> 5473e38 (Construcción de la Página de Inicio (HomePage))
const ProductsPage = () => <div className="container py-5"><h1>Catálogo de Productos</h1></div>;

export default App;
>>>>>>> f624ce9 (Configuración Inicial, Estructura y Layout Principal)
=======
// 3. Elimina el placeholder de ProductsPage que estaba aquí
export default App;
>>>>>>> 11a3261 (Catálogo de Productos con Filtros (ProductsPage))
