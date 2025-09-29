// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import ReviewsModal from '../components/ReviewsModal.jsx';

// Importamos el servicio de productos
import { getFeaturedProducts } from '../services/productService.js';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Cargar productos destacados al montar el componente
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

  // Función simulada para 'onDelete' (solo visual en HomePage)
  const handleDeleteProduct = (id) => {
    console.warn("Función de eliminar solo disponible en el panel de admin.");
  };

  return (
    <>
      {/* --- SECCIÓN HERO --- */}
      <section className="text-center container-fluid py-5 text-white hero-section">
        <div className="row py-lg-5">
          <div className="col-lg-6 col-md-8 mx-auto">
            <h1 className="fw-light section-title" style={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
              Frescura del Campo a tu Hogar
            </h1>
            <p className="lead" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
              Descubre la calidad de los productos de HuertoHogar. ¡Directo de la tierra a tu mesa!
            </p>
            <p>
              <Link to="/productos" className="btn btn-success my-2 btn-lg">Ver Productos</Link>
            </p>
          </div>
        </div>
      </section>

      {/* --- PRODUCTOS DESTACADOS --- */}
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
          <div className="text-center mt-4">
             <Link to="/productos" className="btn btn-outline-secondary">Ver todo el catálogo</Link>
          </div>
        </div>
      </div>

      {/* --- SECCIÓN QUIÉNES SOMOS --- */}
      <section className="container py-5">
        <div className="row">
          <div className="col-lg-8 mx-auto text-center">
            <h2 className="section-title">¿Quiénes Somos?</h2>
            <p className="lead text-muted">
              <strong>HuertoHogar</strong> es una tienda online dedicada a llevar la frescura y calidad de los productos del campo directamente a la puerta de nuestros clientes en Chile.
            </p>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-6 mb-3">
            <div className="card h-100 p-4 shadow-sm border-0">
              <h4 className="text-center title-green">Nuestra Misión</h4>
              <p>Proporcionar productos frescos y de calidad directamente desde el campo, garantizando la frescura y el sabor en cada entrega. Nos comprometemos a fomentar una conexión más cercana entre los consumidores y los agricultores locales.</p>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card h-100 p-4 shadow-sm border-0">
              <h4 className="text-center title-green">Nuestra Visión</h4>
              <p>Ser la tienda online líder en la distribución de productos frescos y naturales en Chile, reconocida por nuestra calidad excepcional, servicio al cliente y compromiso con la sostenibilidad y el comercio justo.</p>
            </div>
          </div>
        </div>
        
        {/* --- MAPA DE SUCURSALES --- */}
        <div className="row mt-5">
          <div className="col-12 text-center mb-3">
            <h3 className="section-title">Nuestras Sucursales</h3>
            <p className="text-muted">Encuéntranos en nuestros puntos de distribución.</p>
          </div>
          <div className="col-12">
            <div className="map-container rounded shadow overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.605858270261!2d-70.65045022346292!3d-33.43691969665177!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c5a368757a1b%3A0x7a056c7296e43f7e!2sPlaza%20de%20Armas%20de%20Santiago!5e0!3m2!1ses!2scl!4v1710360000000!5m2!1ses!2scl"
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

      {/* --- MODAL DE RESEÑAS --- */}
      <ReviewsModal 
        product={selectedProduct} 
        show={isModalVisible} 
        onClose={handleCloseModal} 
      />
    </>
  );
};

export default HomePage;