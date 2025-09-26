import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage'; // Importamos la nueva página
import { CartPage } from './pages/CartPage';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Rutas para la nueva página de productos */}
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:categoryId" element={<ProductsPage />} />
        <Route path="/cart" element={<CartPage />} />
        
        {/* Rutas para el futuro (no creadas aún) */}
        {/* <Route path="/blog" element={<BlogPage />} /> */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;