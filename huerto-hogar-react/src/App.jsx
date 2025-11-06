// src/App.jsx
import { Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// --- Imports de Páginas Públicas ---
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
// TUTOR: Las siguientes 2 líneas de ProductForm y AdminProductListPage se eliminan
// porque pertenecen al CRUD de productos, que aún no hemos conectado.
// import ProductForm from './pages/ProductForm.jsx'; 
// import AdminProductListPage from './pages/admin/AdminProductListPage.jsx';
import CartPage from './pages/CartPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import BlogPage from './pages/BlogPage.jsx';
import ArticlePage from './pages/ArticlePage.jsx';
import CategoriasPage from './pages/CategoriasPage.jsx';
import OfertasPage from './pages/OfertasPage.jsx';
import NosotrosPage from './pages/NosotrosPage.jsx';
import ContactoPage from './pages/ContactoPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderSuccessPage from './pages/OrderSuccessPage.jsx';
import OrderErrorPage from './pages/OrderErrorPage.jsx';

// --- Imports de Páginas de Admin ---
import AdminLayout from './pages/admin/AdminLayout.jsx';
import DashboardPage from './pages/admin/DashboardPage.jsx';


// --- Layout Público (sin cambios) ---
const Layout = () => (
    <div className="d-flex flex-column layout-container">
        <Header />
        <main className="flex-grow-1">
            <Outlet />
        </main>
        <Footer />
    </div>
);

// --- NUEVOS IMPORTS ---
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderSuccessPage from './pages/OrderSuccessPage.jsx';
import OrderErrorPage from './pages/OrderErrorPage.jsx';
// --- FIN NUEVOS IMPORTS ---


const Layout = () => (
    <div className="d-flex flex-column layout-container">
        {/* ... (Header y Footer) ... */}
    </div>
);

function App() {
  return (
    <Routes>
      {/* --- RUTAS PÚBLICAS (usan el Layout con Header/Footer) --- */}
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

      {/* --- RUTAS DE ADMINISTRADOR (usan AdminLayout y protegidas) --- */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute role="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        {/* TUTOR: Las rutas del CRUD de productos se eliminan temporalmente
        <Route path="productos" element={<AdminProductListPage />} />
        <Route path="productos/nuevo" element={<ProductForm />} />
        <Route path="productos/editar/:id" element={<ProductForm />} />
        */}
      </Route>

    </Routes>
  );
}

export default App;
