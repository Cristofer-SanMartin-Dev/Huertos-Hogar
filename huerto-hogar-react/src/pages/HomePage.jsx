// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
<<<<<<< HEAD
<<<<<<< HEAD
import ProductCard from '../components/ProductCard.jsx';
import ReviewsModal from '../components/ReviewsModal.jsx';
import { getFeaturedProducts } from '../services/productService.js';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

=======
import ProductCard from '../components/ProductCard';
import { getFeaturedProducts } from '../services/productService';
=======
import ProductCard from '../components/ProductCard.jsx';
import ReviewsModal from '../components/ReviewsModal.jsx'; // 1. Importa el modal
import { getFeaturedProducts } from '../services/productService.js';
>>>>>>> 3a8df33 (Implementación del Modal de Reseñas)

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  // 2. Estados para controlar el modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

<<<<<<< HEAD
  // Este efecto se ejecuta solo una vez al montar el componente
>>>>>>> 5473e38 (Construcción de la Página de Inicio (HomePage))
=======
>>>>>>> 3a8df33 (Implementación del Modal de Reseñas)
  useEffect(() => {
    setFeaturedProducts(getFeaturedProducts());
  }, []);

<<<<<<< HEAD
<<<<<<< HEAD
=======
  // 3. Funciones para abrir y cerrar el modal
>>>>>>> 3a8df33 (Implementación del Modal de Reseñas)
  const handleViewReviews = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

<<<<<<< HEAD
  return (
    <>
      <section className="text-center container-fluid py-5 text-white" style={{ background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="row py-lg-5">
          <div className="col-lg-6 col-md-8 mx-auto">
            <h1 className="fw-light" style={{fontFamily: 'var(--font-header)', color: 'white'}}>Frescura del Campo a tu Hogar</h1>
            <p className="lead">Descubre la calidad de los productos de HuertoHogar. ¡Directo de la tierra a tu mesa!</p>
            <p><Link to="/productos" className="btn btn-success my-2">Ver Productos</Link></p>
=======
  return (
    <>
      {/* SECCIÓN HERO */}
      <section className="text-center container-fluid py-5 text-white" style={{
        background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="row py-lg-5">
          <div className="col-lg-6 col-md-8 mx-auto">
            <h1 className="fw-light" style={{fontFamily: 'var(--font-header)'}}>Frescura del Campo a tu Hogar</h1>
            <p className="lead">Descubre la calidad de los productos de HuertoHogar. ¡Directo de la tierra a tu mesa!</p>
            <p>
              <Link to="/productos" className="btn btn-success my-2">Ver Productos</Link>
            </p>
>>>>>>> 5473e38 (Construcción de la Página de Inicio (HomePage))
          </div>
        </div>
      </section>

<<<<<<< HEAD
=======
      {/* SECCIÓN PRODUCTOS DESTACADOS */}
>>>>>>> 5473e38 (Construcción de la Página de Inicio (HomePage))
=======
  return (
    <>
      {/* ... (código de la sección HERO y QUIÉNES SOMOS se mantiene igual) ... */}
      <section className="text-center container-fluid py-5 text-white" style={{ background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="row py-lg-5"><div className="col-lg-6 col-md-8 mx-auto"><h1 className="fw-light" style={{fontFamily: 'var(--font-header)'}}>Frescura del Campo a tu Hogar</h1><p className="lead">Descubre la calidad de los productos de HuertoHogar. ¡Directo de la tierra a tu mesa!</p><p><Link to="/productos" className="btn btn-success my-2">Ver Productos</Link></p></div></div>
      </section>

>>>>>>> 3a8df33 (Implementación del Modal de Reseñas)
      <div className="album py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4" style={{fontFamily: 'var(--font-header)', color: 'var(--accent-brown)'}}>Productos Destacados</h2>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {featuredProducts.map(product => (
<<<<<<< HEAD
<<<<<<< HEAD
              <ProductCard key={product.id} product={product} onViewReviews={handleViewReviews} />
=======
              <ProductCard key={product.id} product={product} />
>>>>>>> 5473e38 (Construcción de la Página de Inicio (HomePage))
=======
              // 4. Pasamos la función a cada ProductCard
              <ProductCard key={product.id} product={product} onViewReviews={handleViewReviews} />
>>>>>>> 3a8df33 (Implementación del Modal de Reseñas)
            ))}
          </div>
        </div>
      </div>

<<<<<<< HEAD
<<<<<<< HEAD
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
=======
      {/* SECCIÓN QUIÉNES SOMOS */}
      <section className="container py-5">
        <div className="row">
          <div className="col-lg-8 mx-auto text-center">
            <h2 style={{fontFamily: 'var(--font-header)', color: 'var(--accent-brown)'}}>¿Quiénes Somos?</h2>
            <p className="lead text-muted">
              <strong>HuertoHogar</strong> es una tienda online dedicada a llevar la frescura y calidad de los productos del campo directamente a la puerta de nuestros clientes en Chile.
            </p>
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
>>>>>>> 5473e38 (Construcción de la Página de Inicio (HomePage))
            </div>
          </div>
        </div>
      </section>
<<<<<<< HEAD

=======
      <section className="container py-5"><div className="row"><div className="col-lg-8 mx-auto text-center"><h2 style={{fontFamily: 'var(--font-header)', color: 'var(--accent-brown)'}}>¿Quiénes Somos?</h2><p className="lead text-muted"><strong>HuertoHogar</strong> es una tienda online dedicada a llevar la frescura y calidad de los productos del campo directamente a la puerta de nuestros clientes en Chile.</p></div></div><div className="row mt-4"><div className="col-md-6"><div className="card h-100 p-3"><h4 className="text-center" style={{color: 'var(--accent-green)'}}>Nuestra Misión</h4><p>Proporcionar productos frescos y de calidad directamente desde el campo, garantizando la frescura y el sabor en cada entrega. Nos comprometemos a fomentar una conexión más cercana entre los consumidores y los agricultores locales.</p></div></div><div className="col-md-6 mt-3 mt-md-0"><div className="card h-100 p-3"><h4 className="text-center" style={{color: 'var(--accent-green)'}}>Nuestra Visión</h4><p>Ser la tienda online líder en la distribución de productos frescos y naturales en Chile, reconocida por nuestra calidad excepcional, servicio al cliente y compromiso con la sostenibilidad.</p></div></div></div></section>

      {/* 5. Renderizamos el modal. Se mostrará o no según el estado. */}
>>>>>>> 3a8df33 (Implementación del Modal de Reseñas)
      <ReviewsModal 
        product={selectedProduct} 
        show={isModalVisible} 
        onClose={handleCloseModal} 
      />
<<<<<<< HEAD
=======
>>>>>>> 5473e38 (Construcción de la Página de Inicio (HomePage))
=======
>>>>>>> 3a8df33 (Implementación del Modal de Reseñas)
    </>
  );
};

export default HomePage;