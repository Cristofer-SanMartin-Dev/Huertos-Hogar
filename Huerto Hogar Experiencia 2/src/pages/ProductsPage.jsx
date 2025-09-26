import React, { useState } from 'react'; // 1. Importamos useState
import { ProductCard } from '../components/ProductCard';
import { useParams, Link } from 'react-router-dom'; // Cambiamos NavLink por Link para el dropdown

// (Aquí va tu lista completa de 9 productos con la propiedad 'category')
const products = [
    { id: 'FR001', name: 'Manzanas Fuji', price: 1200, category: 'frutas-frescas', description: 'Crujientes y dulces, del Valle del Maule.', image: 'https://i.imgur.com/2v5s1bs.jpeg' },
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
  // 2. Creamos un estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // 3. Lógica de filtrado combinada
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
    });

  return (
    <div className="container mt-4">
      {/* 4. Nuevos controles de filtrado */}
      <div className="row mb-4">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle w-100" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
              Filtrar por Categoría
            </button>
            <ul className="dropdown-menu w-100" aria-labelledby="dropdownMenuButton1">
              <li><Link className="dropdown-item" to="/products">Mostrar Todos</Link></li>
              <li><Link className="dropdown-item" to="/products/frutas-frescas">Frutas Frescas</Link></li>
              <li><Link className="dropdown-item" to="/products/verduras-organicas">Verduras Orgánicas</Link></li>
              <li><Link className="dropdown-item" to="/products/productos-organicos">Productos Orgánicos</Link></li>
              <li><Link className="dropdown-item" to="/products/productos-lacteos">Productos Lácteos</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Fila para mostrar los productos */}
      <div className="row">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div className="col-lg-4 col-md-6 mb-4" key={product.id}>
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <h3>No se encontraron productos</h3>
            <p>Intenta con otra búsqueda o categoría.</p>
          </div>
        )}
      </div>
    </div>
  );
};