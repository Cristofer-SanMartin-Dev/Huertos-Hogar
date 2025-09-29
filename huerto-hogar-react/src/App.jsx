// src/App.jsx
import { Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// --- Páginas Públicas ---
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

// --- Páginas de Administración ---
import AdminLayout from './pages/admin/AdminLayout.jsx';
import DashboardPage from './pages/admin/DashboardPage.jsx';
// --- FIN NUEVOS IMPORTS ---

// Layout público (sin cambios)
const Layout = () => (
    <div className="d-flex flex-column layout-container" style={{ minHeight: "100vh" }}>
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
        {/* 2. Reemplaza el placeholder con el componente importado */}
        <Route index element={<HomePage />} />
        <Route path="productos" element={<ProductsPage />} />
        <Route path="categorias" element={<CategoriasPage />} />
        <Route path="ofertas" element={<OfertasPage />} />
        <Route path="nosotros" element={<NosotrosPage />} />
        <Route path="contacto" element={<ContactoPage />} />
        
        {/* Blog */}
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:articleId" element={<ArticlePage />} />
        
        {/* Carrito y Checkout */}
        <Route path="carrito" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="pago-exitoso" element={<OrderSuccessPage />} />
        <Route path="pago-error" element={<OrderErrorPage />} />

        {/* Autenticación */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        
        {/* Rutas Protegidas de Usuario */}
        <Route
          path="perfil"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Manejo de 404 */}
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
          <ProtectedRoute role="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        {/* Aquí irán las rutas del CRUD de productos en el futuro */}
      </Route>
    </Routes>
  );
}

// 3. Elimina el placeholder de ProductsPage que estaba aquí
export default App;