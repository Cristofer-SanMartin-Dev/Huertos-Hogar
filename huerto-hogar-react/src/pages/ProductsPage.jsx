// src/pages/ProductsPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import ReviewsModal from '../components/ReviewsModal.jsx';
import SearchBar from '../components/SearchBar.jsx';

// 1. Importación CORREGIDA (Instancia por defecto)
import ProductService from '../services/productService.js';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState('');
  // Permite llegar aquí ya filtrado desde CategoriasPage (?categoria=...).
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categoria') || 'all');

  // 2. Cargar productos desde el Backend
  useEffect(() => {
    ProductService.getAllProducts()
      .then(response => {
        // Axios devuelve los datos en 'response.data'
        setProducts(response.data);
      })
      .catch(error => {
        console.error("Error al cargar los productos:", error);
      });
  }, []);

  // Las categorías del filtro salen de los productos reales, nunca de una
  // lista fija: así nunca se desalinean con lo que hay cargado en el catálogo.
  const categories = useMemo(
    () => [...new Set(products.map(p => p.category).filter(Boolean))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  // Manejo del Modal de Reseñas
  const handleViewReviews = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  // Función simulada para delete (no usada por clientes)
  const handleDelete = () => {
    console.warn("Acción no permitida aquí");
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4 section-title">Nuestros Productos</h2>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewReviews={handleViewReviews}
              onDelete={handleDelete} // Pasamos una función vacía o de log
            />
          ))
        ) : (
          <div className="col-12 text-center">
            <p className="text-muted">
              {products.length === 0 ? 'Cargando productos...' : 'No se encontraron productos con ese filtro.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal de Reseñas */}
      <ReviewsModal 
        product={selectedProduct} 
        show={isModalVisible} 
        onClose={handleCloseModal} 
      />
    </div>
  );
};

export default ProductsPage;