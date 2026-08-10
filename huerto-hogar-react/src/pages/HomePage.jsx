// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import ReviewsModal from '../components/ReviewsModal.jsx';
import BranchesMap from '../components/BranchesMap.jsx';

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

  // En la portada no se elimina: eso vive solo en el panel de administración.
  const handleDeleteProduct = () => {
    console.warn("Función de eliminar solo disponible en el panel de admin.");
  };

  return (
    <>
      {/* --- SECCIÓN HERO --- */}
      <section className="text-center container-fluid py-5 text-white hero-section">
        <div className="row py-lg-5">
          <div className="col-lg-6 col-md-8 mx-auto">
            <h1 className="fw-light section-title">
              Frescura del Campo a tu Hogar
            </h1>
            <p className="lead">
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
          <div className="text-center mt-4">
             <Link to="/productos" className="btn btn-outline-secondary">Ver todo el catálogo</Link>
          </div>
        </div>
      </div>

      {/* TEASER QUIÉNES SOMOS: el detalle de misión y visión vive en /nosotros,
          para no duplicar ese texto en dos páginas. */}
      <section className="container py-5 text-center">
        <div className="col-lg-8 mx-auto">
          <h2 className="section-title">¿Quiénes Somos?</h2>
          <p className="lead text-muted">
            <strong>HuertoHogar</strong> nació de la pasión por la agricultura sostenible y el deseo de conectar a las familias con el origen de sus alimentos.
          </p>
          <Link to="/nosotros" className="btn btn-outline-secondary mt-2">Conoce más sobre nosotros</Link>
        </div>
      </section>

      {/* Mapa de sucursales: pines reales y clicables en las 7 ciudades donde
          opera HuertoHogar, cada uno con su información al hacer clic. */}
      <div className="container pb-5">
        <div className="row">
          <div className="col-12 text-center mb-3"><h3 className="section-title">Nuestras Sucursales</h3><p>Haz clic en un punto del mapa para ver la información de esa sucursal.</p></div>
          <div className="col-12">
            <BranchesMap />
          </div>
        </div>
      </div>

      {/* Modal de reseñas de los productos destacados */}
      <ReviewsModal
        product={selectedProduct}
        show={isModalVisible}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default HomePage;