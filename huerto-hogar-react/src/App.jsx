// src/App.jsx
import { Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
// 1. Importa el nuevo componente de la página del carrito
import CartPage from './pages/CartPage';

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
        {/* 2. Reemplaza el placeholder con el componente real CartPage */}
        <Route path="carrito" element={<CartPage />} />
        <Route path="login" element={<div>Página de Login</div>} />
        <Route path="register" element={<div>Página de Registro</div>} />
        <Route path="perfil" element={<div>Página de Perfil</div>} />
        <Route path="*" element={<div>Página no encontrada</div>} />
      </Route>
    </Routes>
  );
}

export default App;