// src/App.jsx
import { Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

// TUTOR: Creamos un componente "Layout" para no repetir el Header y Footer en cada página.
// <Outlet /> es un marcador de posición de react-router-dom donde se renderizará
// el componente de la página actual (HomePage, ProductsPage, etc.).
const Layout = () => (
  <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
    <Header />
    <main className="flex-grow-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

/**
 * TUTOR: Este es el corazón de la aplicación.
 * Aquí definimos la estructura de las rutas.
 * Todas nuestras páginas se renderizarán dentro del Layout principal.
 * Por ahora, las páginas son solo placeholders simples.
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Aquí irán las rutas anidadas que usarán el Layout */}
        <Route index element={<HomePage />} />
        <Route path="productos" element={<ProductsPage />} />
        {/* Añadimos placeholders para las rutas futuras */}
        <Route path="carrito" element={<div>Página del Carrito</div>} />
        <Route path="login" element={<div>Página de Login</div>} />
        <Route path="register" element={<div>Página de Registro</div>} />
        <Route path="perfil" element={<div>Página de Perfil</div>} />
        <Route path="*" element={<div>Página no encontrada</div>} />
      </Route>
    </Routes>
  );
}

// --- Componentes Placeholder para las Páginas ---
// (Los moveremos a sus propios archivos en los siguientes commits)
const HomePage = () => <div className="container text-center py-5"><h1>Página de Inicio</h1></div>;
const ProductsPage = () => <div className="container py-5"><h1>Catálogo de Productos</h1></div>;

export default App;