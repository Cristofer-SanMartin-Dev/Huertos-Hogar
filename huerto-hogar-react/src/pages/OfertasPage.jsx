import React from 'react';
import { Link } from 'react-router-dom';

// TUTOR: Esta página es para la ruta /ofertas[cite: 889].
// Por ahora es un placeholder.
const OfertasPage = () => {
    return (
        <div className="container text-center py-5">
            <h2 className="section-title">Ofertas</h2>
            <p className="lead text-muted">Próximamente encontrarás aquí las mejores ofertas de HuertoHogar.</p>
            <Link to="/productos" className="btn btn-primary mt-3">
                Ver todos los productos
            </Link>
        </div>
    );
};

export default OfertasPage;