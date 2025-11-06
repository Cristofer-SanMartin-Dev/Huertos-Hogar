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
import CategoriasPage from './pages/CategoriasPage.jsx';
import OfertasPage from './pages/OfertasPage.jsx';
import NosotrosPage from './pages/NosotrosPage.jsx';
import ContactoPage from './pages/ContactoPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderSuccessPage from './pages/OrderSuccessPage.jsx';
import OrderErrorPage from './pages/OrderErrorPage.jsx';

// --- NUEVOS IMPORTS DE ADMIN ---
import AdminLayout from './pages/admin/AdminLayout.jsx';
import DashboardPage from './pages/admin/DashboardPage.jsx';
// --- FIN NUEVOS IMPORTS ---

// Layout público (sin cambios)
const Layout = () => (
    <div className="d-flex flex-column layout-container">
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
      {/* --- RUTAS PÚBLICAS (usando el Layout con Header/Footer) --- */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="productos" element={<ProductsPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:articleId" element={<ArticlePage />} />
        <Route path="carrito" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="pago-exitoso" element={<OrderSuccessPage />} />
        <Route path="pago-error" element={<OrderErrorPage />} />
        <Route path="categorias" element={<CategoriasPage />} />
        <Route path="ofertas" element={<OfertasPage />} />
        <Route path="nosotros" element={<NosotrosPage />} />
        <Route path="contacto" element={<ContactoPage />} />
        
        {/* Ruta de Perfil (Protegida) */}
        <Route
          path="perfil"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<div className="container text-center py-5"><h2 className="section-title">404: Página no encontrada</h2></div>} />
      </Route>

      {/* --- NUEVAS RUTAS DE ADMINISTRADOR (usando AdminLayout) --- */}
      {/* TUTOR: Este grupo de rutas está anidado.
        1. Protegemos toda la sección /admin con <ProtectedRoute>.
        2. Usamos <AdminLayout /> como el contenedor visual (con Sidebar).
        3. <DashboardPage /> se mostrará en el <Outlet /> de AdminLayout cuando la ruta sea exactamente /admin.
      */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        {/* Aquí añadiremos las otras páginas de admin (ej: /admin/productos) */}
      </Route>

    </Routes>
  );
}

export default App;
