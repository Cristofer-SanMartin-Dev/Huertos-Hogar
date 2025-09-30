// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Importa los componentes reutilizables
import ProductCard from '../components/ProductCard.jsx';
import ReviewsModal from '../components/ReviewsModal.jsx';

// TUTOR: 1. Importamos las funciones simuladas desde el servicio de datos local.
import { getFeaturedProducts } from '../services/productService.js';

const HomePage = () => {
  // Estado para guardar los productos destacados
  const [featuredProducts, setFeaturedProducts] = useState([]);
  
  // Estados para controlar el modal de reseñas
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // TUTOR: 2. useEffect se ejecuta una vez al cargar la página.
  useEffect(() => {
    // Llama a la función simulada y guarda los productos en el estado.
    setFeaturedProducts(getFeaturedProducts());
  }, []); // El array vacío `[]` asegura que se ejecute solo una vez.

  // TUTOR: 3. Función simulada para 'onDelete'
  // Los ProductCard necesitan esta prop, pero en la vista pública no hace nada.
  const handleDeleteProduct = (id) => {
    alert('La gestión de productos se realiza en el panel de administrador.');
  };

  // Función para abrir el modal (pasa al ProductCard)
  const handleViewReviews = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  // Función para cerrar el modal (pasa al ReviewsModal)
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
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

      {/* --- SECCIÓN PRODUCTOS DESTACADOS --- */}
      <div className="album py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4 section-title">Productos Destacados</h2>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {/* Mapea los productos destacados del estado */}
            {featuredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onViewReviews={handleViewReviews} 
                onDelete={handleDeleteProduct} // Le pasamos la función simulada
              />
            ))}
          </div>
        </div>
      </div>

      {/* --- SECCIÓN QUIÉNES SOMOS --- */}
      <section className="container py-5">
        <div className="row">
          <div className="col-lg-8 mx-auto text-center">
            <h2 className="section-title">¿Quiénes Somos?</h2>
            <p className="lead text-muted"><strong>HuertoHogar</strong> es una tienda online dedicada a llevar la frescura y calidad de los productos del campo directamente a la puerta de nuestros clientes en Chile.</p>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-6">
            <div className="card h-100 p-3">
              <h4 className="text-center" style={{color: 'var(--accent-green)'}}>Nuestra Misión</h4>
              <p>Proporcionar productos frescos y de calidad directamente desde el campo, garantizando la frescura y el sabor en cada entrega. Nos comprometemos a fomentar una conexión más cercana entre los consumidores y los agricultores locales.</p>
            </div>
          </div>
          <div className="col-md-6 mt-3 mt-md-0">
            <div className="card h-100 p-3">
              <h4 className="text-center" style={{color: 'var(--accent-green)'}}>Nuestra Visión</h4>
              <p>Ser la tienda online líder en la distribución de productos frescos y naturales en Chile, reconocida por nuestra calidad excepcional, servicio al cliente y compromiso con la sostenibilidad.</p>
            </div>
          </div>
        </div>

        {/* --- SECCIÓN DEL MAPA --- */}
        <div className="row mt-5">
          <div className="col-12 text-center">
            <h3 className="section-title">Nuestras Sucursales</h3>
            <p className="text-muted">Operamos en más de 9 puntos a lo largo del país.</p>
          </div>
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