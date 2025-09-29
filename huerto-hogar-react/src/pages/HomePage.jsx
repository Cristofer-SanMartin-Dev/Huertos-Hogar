// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import ReviewsModal from '../components/ReviewsModal.jsx';

// TUTOR: 1. Esta importación ahora SÍ coincide con el productService.js
import { getFeaturedProducts } from '../services/productService.js';

/**
 * TUTOR: Este componente representa la página de inicio completa.
 * - `useEffect` se usa para cargar los productos destacados cuando el componente se muestra por primera vez.
 * - `useState` almacena esos productos en el estado `featuredProducts`.
 * - Reutilizamos el componente `ProductCard` para mostrar los productos.
 * - Las secciones (Hero, About Us) están separadas lógicamente.
 */
const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  // Este efecto se ejecuta solo una vez al montar el componente
  useEffect(() => {
    // 2. Llama a la función simulada
    setFeaturedProducts(getFeaturedProducts());
  }, []);

  const handleViewReviews = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  // 3. Función simulada para 'onDelete' (los botones de admin no deberían estar en ProductCard)
  const handleDeleteProduct = (id) => {
    console.warn("Función de eliminar solo disponible en el panel de admin.");
  };

  return (
    <>
      {/* --- SECCIÓN HERO --- */}
      <section className="text-center container-fluid py-5 text-white hero-section">
        <div className="row py-lg-5">
            <div className="col-lg-6 col-md-8 mx-auto">
                <h1 className="fw-light section-title" style={{color: 'white'}}>Frescura del Campo a tu Hogar</h1>
                <p className="lead">Descubre la calidad de los productos de HuertoHogar. ¡Directo de la tierra a tu mesa!</p>
                <p><Link to="/productos" className="btn btn-success my-2">Ver Productos</Link></p>
            </div>
        </div>
      </section>

      {/* SECCIÓN PRODUCTOS DESTACADOS */}
      <div className="album py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4 section-title">Productos Destacados</h2>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {featuredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onViewReviews={handleViewReviews} 
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>
        </div>
      </div>

      {/* SECCIÓN QUIÉNES SOMOS */}
      <section className="container py-5">
        <div className="row">
          <div className="col-lg-8 mx-auto text-center">
            <h2 className="section-title">¿Quiénes Somos?</h2>
            <p className="lead text-muted"><strong>HuertoHogar</strong>...</p>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-6"><div className="card h-100 p-3"><h4 className="text-center" style={{color: 'var(--accent-green)'}}>Nuestra Misión</h4><p>...</p></div></div>
          <div className="col-md-6 mt-3 mt-md-0"><div className="card h-100 p-3"><h4 className="text-center" style={{color: 'var(--accent-green)'}}>Nuestra Visión</h4><p>...</p></div></div>
        </div>
        <div className="row mt-5">
          <div className="col-12 text-center"><h3 className="section-title">Nuestras Sucursales</h3><p>...</p></div>
          <div className="col-12">
            <div className="map-container rounded shadow overflow-hidden">
              <iframe 
                src="http://googleusercontent.com/maps/google.com/4"
                width="100%" 
                height="100%" 
                style={{ border: 0 }}
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa de Sucursales de HuertoHogar"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* --- MODAL --- */}
      <ReviewsModal 
        product={selectedProduct} 
        show={isModalVisible} 
        onClose={handleCloseModal} 
      />
    </>
  );
};

export default HomePage;