// src/App.jsx
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
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
        {/* 2. Reemplazamos los placeholders con los componentes reales */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        {/* 3. Protegemos la ruta del perfil */}
        <Route 
          path="perfil" 
          element={
            <ProtectedRoute>
              <div>Página de Perfil (Protegida)</div>
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<div>Página no encontrada</div>} />
      </Route>
    </Routes>
  );
}

export default App;