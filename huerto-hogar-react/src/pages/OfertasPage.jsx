import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import ReviewsModal from '../components/ReviewsModal.jsx';
import ProductService from '../services/productService.js';

const OfertasPage = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        ProductService.getAllProducts()
            .then(response => setProducts(response.data))
            .catch(error => console.error('Error al cargar las ofertas:', error))
            .finally(() => setIsLoading(false));
    }, []);

    const handleViewReviews = (product) => {
        setSelectedProduct(product);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedProduct(null);
    };

    const ofertas = products.filter(p => p.descuento > 0);

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4 section-title">Ofertas</h2>

            {isLoading ? (
                <p className="text-center text-muted">Cargando ofertas...</p>
            ) : ofertas.length > 0 ? (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                    {ofertas.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onViewReviews={handleViewReviews}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-5">
                    <p className="lead text-muted">No hay ofertas disponibles por el momento.</p>
                    <Link to="/productos" className="btn btn-primary mt-3">
                        Ver todos los productos
                    </Link>
                </div>
            )}

            <ReviewsModal
                product={selectedProduct}
                show={isModalVisible}
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default OfertasPage;
