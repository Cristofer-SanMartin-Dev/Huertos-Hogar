// src/App.jsx
import { Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
// 1. Importa el componente real de la página de productos
import ProductsPage from './pages/ProductsPage';


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

// 3. Elimina el placeholder de ProductsPage que estaba aquí
export default App;