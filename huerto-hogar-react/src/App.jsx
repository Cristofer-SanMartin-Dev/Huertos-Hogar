// src/App.jsx
import { lazy, Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import BlogPage from './pages/BlogPage.jsx';
import ArticlePage from './pages/ArticlePage.jsx';
import CategoriasPage from './pages/CategoriasPage.jsx';
import OfertasPage from './pages/OfertasPage.jsx';
import NosotrosPage from './pages/NosotrosPage.jsx';
import ContactoPage from './pages/ContactoPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderSuccessPage from './pages/OrderSuccessPage.jsx';
import OrderErrorPage from './pages/OrderErrorPage.jsx';
import OrderDetailPage from './pages/OrderDetailPage.jsx';

// --- Páginas de Administración ---
// 'lazy': solo un cliente que además es admin llega a descargar este código,
// así que no tiene sentido que infle el bundle inicial de la tienda pública.
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout.jsx'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage.jsx'));
const ProductForm = lazy(() => import('./pages/admin/ProductForm.jsx'));
const AdminProductListPage = lazy(() => import('./pages/admin/AdminProductListPage.jsx'));
const ContactMessagesPage = lazy(() => import('./pages/admin/ContactMessagesPage.jsx'));
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage.jsx'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage.jsx'));
const AdminCategoriesPage = lazy(() => import('./pages/admin/AdminCategoriesPage.jsx'));
const AdminReportsPage = lazy(() => import('./pages/admin/AdminReportsPage.jsx'));

const AdminLoading = () => (
  <div className="container py-5 text-center text-muted">Cargando panel de administración...</div>
);

// --- Layout Público (sin cambios) ---
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
    <>
    <Routes>
      {/* --- RUTAS PÚBLICAS (usan el Layout con Header/Footer) --- */}
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
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route path="pago-exitoso" element={<OrderSuccessPage />} />
        <Route path="pago-error" element={<OrderErrorPage />} />
        <Route
          path="pedidos/:id"
          element={
            <ProtectedRoute>
              <OrderDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Autenticación */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:articleId" element={<ArticlePage />} />
        
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

      {/* --- RUTAS DE ADMINISTRADOR (usan AdminLayout y protegidas) ---
          Todo el subárbol (AdminLayout + las páginas que renderiza su Outlet)
          comparte este único Suspense: alcanza porque el Outlet las monta
          dentro del mismo árbol de React que ya está envuelto por él. */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <Suspense fallback={<AdminLoading />}>
              <AdminLayout />
            </Suspense>
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />

        {/* CRUD de productos */}
        <Route path="productos" element={<AdminProductListPage />} />
        <Route path="productos/nuevo" element={<ProductForm />} />
        <Route path="productos/editar/:id" element={<ProductForm />} />

        {/* Mensajes de contacto */}
        <Route path="mensajes" element={<ContactMessagesPage />} />

        {/* Pedidos */}
        <Route path="ordenes" element={<AdminOrdersPage />} />

        {/* Usuarios, Categorías y Reportes */}
        <Route path="usuarios" element={<AdminUsersPage />} />
        <Route path="categorias" element={<AdminCategoriesPage />} />
        <Route path="reportes" element={<AdminReportsPage />} />

        {/* Perfil del admin: mismo componente que usan los clientes, ya
            funciona para cualquier usuario autenticado sin importar el rol. */}
        <Route path="perfil" element={<ProfilePage />} />

        {/* Cualquier otra ruta del panel que no exista */}
        <Route
          path="*"
          element={
            <div className="container mt-4">
              <h2>Sección en construcción</h2>
              <p className="text-muted">Esta parte del panel de administración todavía no está implementada.</p>
            </div>
          }
        />
      </Route>
    </Routes>
    <ToastContainer position="bottom-right" autoClose={3000} newestOnTop />
    </>
  );
}

export default App;