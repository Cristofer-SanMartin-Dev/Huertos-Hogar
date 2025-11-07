// src/pages/ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/productService.js';
import ProductCard from '../components/ProductCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import ReviewsModal from '../components/ReviewsModal.jsx'; // 1. Importa el modal

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 2. Estados para controlar el modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const allProducts = getProducts();
    setProducts(allProducts);
    setFilteredProducts(allProducts);
  }, []);

  useEffect(() => {
    let result = products;
    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }
    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]);
  
  const categories = [...new Set(products.map(p => p.category))];
  
  // 3. Funciones para abrir y cerrar el modal
  const handleViewReviews = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

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
            // 4. Pasamos la función a cada ProductCard
            <ProductCard key={product.id} product={product} onViewReviews={handleViewReviews} />
          ))
        ) : (
          <p className="col-12 text-center text-muted">No se encontraron productos que coincidan con tu búsqueda.</p>
        )}
      </div>

      {/* 5. Renderizamos el modal */}
      <ReviewsModal 
        product={selectedProduct} 
        show={isModalVisible} 
        onClose={handleCloseModal} 
      />
    </div>
  );
};

export default ProductsPage;