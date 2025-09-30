// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import ReviewsModal from '../components/ReviewsModal.jsx';
import { getFeaturedProducts } from '../services/productService.js';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
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

  return (
    <>
      {/* --- SECCIÓN HERO --- */}
      <section className="text-center container-fluid py-5 text-white" style={{ background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="row py-lg-5"><div className="col-lg-6 col-md-8 mx-auto"><h1 className="fw-light" style={{fontFamily: 'var(--font-header)'}}>Frescura del Campo a tu Hogar</h1><p className="lead">Descubre la calidad de los productos de HuertoHogar. ¡Directo de la tierra a tu mesa!</p><p><Link to="/productos" className="btn btn-success my-2">Ver Productos</Link></p></div></div>
      </section>

      {/* --- SECCIÓN PRODUCTOS DESTACADOS --- */}
      <div className="album py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4" style={{fontFamily: 'var(--font-header)', color: 'var(--accent-brown)'}}>Productos Destacados</h2>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} onViewReviews={handleViewReviews} />
            ))}
          </div>
        </div>
      </div>

      {/* --- SECCIÓN QUIÉNES SOMOS --- */}
      <section className="container py-5">
        <div className="row">
          <div className="col-lg-8 mx-auto text-center">
            <h2 style={{fontFamily: 'var(--font-header)', color: 'var(--accent-brown)'}}>¿Quiénes Somos?</h2>
            [cite_start]<p className="lead text-muted"><strong>HuertoHogar</strong> es una tienda online dedicada a llevar la frescura y calidad de los productos del campo directamente a la puerta de nuestros clientes en Chile. [cite: 126]</p>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-6">
            <div className="card h-100 p-3">
              <h4 className="text-center" style={{color: 'var(--accent-green)'}}>Nuestra Misión</h4>
              [cite_start]<p>Proporcionar productos frescos y de calidad directamente desde el campo hasta la puerta de nuestros clientes, garantizando la frescura y el sabor en cada entrega. [cite: 130] [cite_start]Nos comprometemos a fomentar una conexión más cercana entre los consumidores y los agricultores locales. [cite: 131]</p>
            </div>
          </div>
          <div className="col-md-6 mt-3 mt-md-0">
            <div className="card h-100 p-3">
              <h4 className="text-center" style={{color: 'var(--accent-green)'}}>Nuestra Visión</h4>
              [cite_start]<p>Ser la tienda online líder en la distribución de productos frescos y naturales en Chile, reconocida por nuestra calidad excepcional, servicio al cliente y compromiso con la sostenibilidad. [cite: 133]</p>
            </div>
          </div>
        </div>

        {/* TUTOR: Aquí añadimos la nueva sección del mapa.
          - Usamos un `iframe` que es un código estándar para incrustar contenido de otras páginas.
          - Este `iframe` en particular muestra un mapa de Google centrado en Chile.
          - Le damos estilos de Bootstrap (`rounded`, `shadow`) y CSS en línea para que se vea bien
            y sea responsivo (width: 100%).
          - El caso de estudio menciona las ciudades: Santiago, Puerto Montt, Villarica, Nacimiento, 
            [cite_start]Viña del Mar, Valparaíso, y Concepción. [cite: 181]
        */}
        <div className="row mt-5">
          <div className="col-12 text-center">
            <h3 style={{fontFamily: 'var(--font-header)', color: 'var(--accent-brown)'}}>Nuestras Sucursales</h3>
            [cite_start]<p className="text-muted">Operamos en más de 9 puntos a lo largo del país. [cite: 127]</p>
          </div>
          <div className="col-12">
            <div className="map-container rounded shadow overflow-hidden" style={{height: '450px'}}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d10825315.111872175!2d-76.3484210671607!3d-37.06739343940191!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sSantiago%2C%20Puerto%20Montt%2C%20Villarrica%2C%20Nacimiento%2C%20Vi%C3%B1a%20del%20Mar%2C%20Valpara%C3%ADso%2C%20y%20Concepci%C3%B3n!5e0!3m2!1ses-419!2scl!4v1699981234567!5m2!1ses-419!2scl" 
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

      <ReviewsModal 
        product={selectedProduct} 
        show={isModalVisible} 
        onClose={handleCloseModal} 
      />
    </>
  );
};

export default HomePage;