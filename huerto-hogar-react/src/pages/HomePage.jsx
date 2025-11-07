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
      <section className="text-center container-fluid py-5 text-white" style={{ background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="row py-lg-5">
          <div className="col-lg-6 col-md-8 mx-auto">
            <h1 className="fw-light" style={{fontFamily: 'var(--font-header)', color: 'white'}}>Frescura del Campo a tu Hogar</h1>
            <p className="lead">Descubre la calidad de los productos de HuertoHogar. ¡Directo de la tierra a tu mesa!</p>
            <p><Link to="/productos" className="btn btn-success my-2">Ver Productos</Link></p>
          </div>
        </div>
      </section>

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

      <section className="container py-5">
        <div className="row">
          <div className="col-lg-8 mx-auto text-center">
            <h2 style={{fontFamily: 'var(--font-header)', color: 'var(--accent-brown)' }}>¿Quiénes Somos?</h2>
            <p className="lead text-muted"><strong>HuertoHogar</strong> es una tienda online dedicada a llevar la frescura y calidad de los productos del campo 
directamente a la puerta de nuestros clientes en Chile. Con más de 6 años de experiencia, operamos 
en más de 9 puntos a lo largo del país, incluyendo ciudades clave como Santiago, Puerto Montt, 
Villarica, Nacimiento, Viña del Mar, Valparaíso, y Concepción. Nuestra misión es conectar a las 
familias chilenas con el campo, promoviendo un estilo de vida saludable y sostenible. </p>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-6"><div className="card h-100 p-3"><h4 className="text-center" style={{color: 'var(--accent-green)',fontWeight: 'bolder'}}>Nuestra Misión</h4><p>Nuestra misión es proporcionar productos frescos y de calidad directamente desde el campo hasta 
la puerta de nuestros clientes, garantizando la frescura y el sabor en cada entrega. Nos 
comprometemos a fomentar una conexión más cercana entre los consumidores y los agricultores 
locales, apoyando prácticas agrícolas sostenibles y promoviendo una alimentación saludable en 
todos los hogares chilenos. </p></div></div>
          <div className="col-md-6 mt-3 mt-md-0"><div className="card h-100 p-3"><h4 className="text-center" style={{color: 'var(--accent-green)',fontWeight: 'bolder'}}>Nuestra Visión</h4><p>Nuestra visión es ser la tienda online líder en la distribución de productos frescos y naturales en 
Chile, reconocida por nuestra calidad excepcional, servicio al cliente y compromiso con la 
sostenibilidad. Aspiramos a expandir nuestra presencia a nivel nacional e internacional, 
estableciendo un nuevo estándar en la distribución de productos agrícolas directos del productor al 
consumidor. </p></div></div>
        </div>

        <div className="row mt-5">
          <div className="col-12 text-center">
            <h3 style={{fontFamily: 'var(--font-header)', color: 'var(--accent-brown)'}}>Nuestras Sucursales</h3>
            <p className="text-muted">Operamos en más de 9 puntos a lo largo del país.</p>
          </div>
          <div className="col-12">
            <div className="rounded shadow overflow-hidden" style={{height: '450px'}}>
              <iframe src="https://www.google.com/maps/d/embed?mid=1LFLmV5fwL4XYT8AbiP8bqMANTl5BJlE&ehbc=2E312F" width="100%" height="100%"></iframe>
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