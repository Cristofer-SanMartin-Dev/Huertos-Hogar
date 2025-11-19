// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import ReviewsModal from '../components/ReviewsModal.jsx';

// 1. Importa el servicio completo (instancia por defecto)
import ProductService from '../services/productService.js';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // 2. Llama a la API real para obtener productos
    ProductService.getAllProducts()
      .then(response => {
        // Filtramos o tomamos los primeros 3 productos para "Destacados"
        // Si tu backend tuviera un endpoint /featured, lo usaríamos aquí.
        const allProducts = response.data;
        const top3 = allProducts.slice(0, 3); 
        setFeaturedProducts(top3);
      })
      .catch(error => {
        console.error("Error al cargar productos destacados:", error);
        // Opcional: Poner productos vacíos o mostrar un mensaje
        setFeaturedProducts([]);
      });
  }, []);

  const handleViewReviews = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  // Función simulada para 'onDelete' (no hace nada en Home)
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

      {/* --- SECCIÓN PRODUCTOS DESTACADOS --- */}
      <div className="album py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4 section-title">Productos Destacados</h2>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {/* Renderizado condicional por si no hay productos aún */}
            {featuredProducts.length > 0 ? (
                featuredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onViewReviews={handleViewReviews} 
                    onDelete={handleDeleteProduct}
                  />
                ))
            ) : (
                <div className="col-12 text-center">
                    <p>Cargando productos destacados o no hay stock disponible...</p>
                </div>
            )}
          </div>
        </div>
      </div>

      {/* --- SECCIÓN QUIÉNES SOMOS --- */}
      <section className="container py-5">
        <div className="row">
          <div className="col-lg-8 mx-auto text-center">
            <h2 className="section-title">¿Quiénes Somos?</h2>
            <p className="lead text-muted"><strong>HuertoHogar</strong> es una iniciativa nacida de la pasión por la agricultura sostenible y el deseo de conectar a las familias con el origen de sus alimentos. Trabajamos directamente con agricultores locales para asegurar que cada producto que llega a tu mesa sea fresco, saludable y cultivado con respeto por la tierra.</p>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-6"><div className="card h-100 p-3"><h4 className="text-center" style={{color: 'var(--accent-green)'}}>Nuestra Misión</h4><p>Llevar frescura y calidad a cada hogar, fomentando el consumo responsable y apoyando a la economía local.</p></div></div>
          <div className="col-md-6 mt-3 mt-md-0"><div className="card h-100 p-3"><h4 className="text-center" style={{color: 'var(--accent-green)'}}>Nuestra Visión</h4><p>Ser el referente nacional en distribución de productos orgánicos y locales, creando una comunidad consciente y saludable.</p></div></div>
        </div>
        
        {/* Sección del Mapa (Corregido el src para evitar errores 404 falsos, o puedes dejarlo vacío) */}
        <div className="row mt-5">
          <div className="col-12 text-center"><h3 className="section-title">Nuestras Sucursales</h3><p>Encuéntranos en nuestros puntos de retiro a lo largo del país.</p></div>
          <div className="col-12">
            <div className="map-container rounded shadow overflow-hidden">
                {/* Nota: Usamos un mapa de ejemplo de Google Maps Embed API */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.850318587988!2d-70.6508826848009!3d-33.44013418077967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c5a7c6e2c7c1%3A0x3e0b7f7b7b7b7b7b!2sSantiago%2C%20Chile!5e0!3m2!1ses!2scl!4v1620000000000!5m2!1ses!2scl"
                width="100%" 
                height="100%" 
                style={{ border: 0 }}
                allowFullScreen="" 
                loading="lazy" 
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