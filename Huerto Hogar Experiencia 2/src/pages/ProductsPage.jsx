import React, { useState, useContext } from 'react';
import { ProductCard } from '../components/ProductCard';
import { useParams, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

// Datos de productos (puedes mover esto a un archivo aparte si lo prefieres)
const products = [
  {
    id: 'FR001',
    name: 'Manzanas Fuji',
    price: 1200,
    description: 'Crujientes y dulces, cultivadas en el Valle del Maule. Perfectas para meriendas.',
    stock: 150,
    category: 'Frutas Frescas',
    imageUrl: require('../assets/manzana.png'),
    rating: 4.5,
    reviews: [
      { user: 'Ana Pérez', date: '2025-08-20', comment: '¡Deliciosas y muy frescas! Las mejores que he probado.' },
      { user: 'Carlos Soto', date: '2025-08-18', comment: 'Llegaron en perfecto estado. Muy recomendables.' }
    ]
  },
  { id: 'FR002', name: 'Naranjas Valencia', price: 1000, category: 'frutas-frescas', description: 'Jugosas y ricas en vitamina C, ideales para zumos.', image: 'https://i.imgur.com/s6n5m7L.jpeg' },
  { id: 'FR003', name: 'Plátanos Cavendish', price: 800, category: 'frutas-frescas', description: 'Maduros y dulces, perfectos como snack energético.', image: 'https://i.imgur.com/oKudl0a.jpeg' },
  { id: 'VR001', name: 'Zanahorias Orgánicas', price: 900, category: 'verduras-organicas', description: 'Cultivadas sin pesticidas en la Región de O\'Higgins.', image: 'https://i.imgur.com/j7k2H1z.jpeg' },
  { id: 'VR002', name: 'Espinacas Frescas', price: 700, category: 'verduras-organicas', description: 'Bolsa de 500g, perfectas para ensaladas y batidos.', image: 'https://i.imgur.com/RO86sE0.jpeg' },
  { id: 'VR003', name: 'Pimientos Tricolores', price: 1500, category: 'verduras-organicas', description: 'Pimientos rojos, amarillos y verdes para salteados.', image: 'https://i.imgur.com/sWCoN2i.jpeg' },
  { id: 'PO001', name: 'Miel Orgánica', price: 5000, category: 'productos-organicos', description: 'Frasco de 500g. Producida por apicultores locales.', image: 'https://i.imgur.com/Z4M3p2y.jpeg' },
  { id: 'PO003', name: 'Quinua Orgánica', price: 4500, category: 'productos-organicos', description: 'Granos andinos llenos de proteínas y nutrientes. (Info Provisional)', image: 'https://i.imgur.com/8p8YvF1.jpeg' },
  { id: 'PL001', name: 'Leche Entera', price: 1100, category: 'productos-lacteos', description: 'Leche fresca y natural de granjas locales. (Info Provisional)', image: 'https://i.imgur.com/ADiA52j.jpeg' }
];

export const ProductsPage = () => {
  const { categoryId } = useParams();
  const { addToCart } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

  // Lógica de filtrado combinada
  const filteredProducts = products
    .filter(product => {
      // Filtro por categoría (de la URL)
      if (categoryId) {
        return product.category === categoryId;
      }
      return true; // Si no hay categoría, no filtra nada
    })
    .filter(product => {
      // Filtro por nombre (del estado searchTerm)
      return product.name.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'all' || product.category === category;
      return matchesSearch && matchesCategory;
    });

  return (
    <div className="container py-4">
      {/* Header */}
      <header className="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom">
        <h1 className="my-0 mr-md-auto font-weight-normal">
          <a href="/" className="text-decoration-none text-dark">HuertoHogar</a>
        </h1>
        <nav className="my-2 my-md-0 mr-md-3">
          <a className="p-2 text-dark" href="/">Inicio</a>
          <a className="p-2 text-dark" href="/productos">Productos</a>
          <a className="p-2 text-dark" href="/carrito">Carrito</a>
          <a className="p-2 text-dark" href="/login">Iniciar Sesión</a>
          <a className="p-2 text-dark d-none" href="/perfil">Mi Perfil</a>
        </nav>
      </header>

      {/* Catálogo */}
      <main>
        <h2>Nuestro Catálogo</h2>
        <div className="row mb-4">
          <div className="col-md-6 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-2">
            <select
              className="form-select"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="all">Todas las categorías</option>
              <option value="Frutas Frescas">Frutas Frescas</option>
              <option value="Verduras Orgánicas">Verduras Orgánicas</option>
              <option value="Productos Orgánicos">Productos Orgánicos</option>
              <option value="Productos Lácteos">Productos Lácteos</option>
            </select>
          </div>
        </div>
        <div className="row" id="product-grid">
          {filteredProducts.length === 0 ? (
            <p>No se encontraron productos.</p>
          ) : (
            filteredProducts.map(product => (
              <div key={product.id} className="col-md-4 mb-4">
                <div className="card h-100">
                  <img src={product.imageUrl} alt={product.name} className="card-img-top" style={{ height: 180, objectFit: 'cover' }} />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">{product.description}</p>
                    <p className="card-text"><strong>${product.price.toLocaleString('es-CL')}</strong></p>
                    <button
                      className="btn btn-success w-100"
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Modal de Reseñas (puede implementarse con Bootstrap Modal en el futuro) */}
      {/* ... */}

      {/* Footer */}
      <footer className="footer mt-auto py-3 bg-dark text-white">
        <div className="container text-center">
          <p>&copy; 2025 HuertoHogar. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default ProductsPage;