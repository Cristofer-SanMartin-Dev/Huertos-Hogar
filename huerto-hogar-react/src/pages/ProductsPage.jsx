// src/pages/ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/productService.js';
import ProductCard from '../components/ProductCard.jsx';
import SearchBar from '../components/SearchBar.jsx';

// TUTOR: Página del catálogo con lógica de estado para búsqueda y filtrado.
const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Efecto para cargar los productos una sola vez.
  useEffect(() => {
    const allProducts = getProducts();
    setProducts(allProducts);
    setFilteredProducts(allProducts);
  }, []);

  // Efecto que se ejecuta cada vez que cambia el término de búsqueda o la categoría.
  useEffect(() => {
    let result = products;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]);
  
  // Extraemos las categorías únicas para el dropdown del filtro.
  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4" style={{ fontFamily: 'var(--font-header)', color: 'var(--accent-brown)' }}>
        Nuestro Catálogo
      </h2>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="col-12 text-center text-muted">No se encontraron productos que coincidan con tu búsqueda.</p>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;