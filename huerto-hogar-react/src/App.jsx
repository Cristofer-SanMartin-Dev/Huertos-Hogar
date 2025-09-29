// src/App.jsx
import { Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
// 1. Importa el componente real de la página de inicio
import HomePage from './pages/HomePage';

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
        {/* 2. Reemplaza el placeholder con el componente importado */}
        <Route index element={<HomePage />} />
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

// 3. Elimina el placeholder de HomePage que estaba aquí
const ProductsPage = () => <div className="container py-5"><h1>Catálogo de Productos</h1></div>;

export default App;