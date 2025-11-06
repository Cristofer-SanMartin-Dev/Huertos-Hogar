// src/App.jsx
import { Routes, Route, Outlet } from 'react-router-dom';
// ... (imports de Layout, HomePage, ProductsPage, etc.)
import CartPage from './pages/CartPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import BlogPage from './pages/BlogPage.jsx';
import ArticlePage from './pages/ArticlePage.jsx';

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
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="productos" element={<ProductsPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:articleId" element={<ArticlePage />} />
        <Route path="carrito" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        
        {/* --- NUEVAS RUTAS --- */}
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="pago-exitoso" element={<OrderSuccessPage />} />
        <Route path="pago-error" element={<OrderErrorPage />} />
        {/* --- FIN NUEVAS RUTAS --- */}

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
    </Routes>
  );
}

export default App;
