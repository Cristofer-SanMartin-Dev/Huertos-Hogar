// src/pages/ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import ReviewsModal from '../components/ReviewsModal.jsx';
import { useCart } from '../context/CartContext.jsx'; // Si usas el carrito aquí

// 1. Importación CORREGIDA (Instancia por defecto)
import ProductService from '../services/productService.js';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
      
      {/* Filtros (Opcional: Aquí podrías agregar un input para filtrar por nombre) */}
      
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onViewReviews={handleViewReviews}
              onDelete={handleDelete} // Pasamos una función vacía o de log
            />
          ))
        ) : (
          <div className="col-12 text-center">
            <p className="text-muted">Cargando productos o no hay stock disponible...</p>
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