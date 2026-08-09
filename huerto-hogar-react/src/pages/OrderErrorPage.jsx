// src/pages/OrderErrorPage.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const OrderErrorPage = () => {
    const location = useLocation();
    const message = location.state?.message;

    return (
        <div className="container text-center py-5">
            <div className="login-container" style={{maxWidth: '600px'}}>
                <h2 className="section-title text-danger">❌ No se pudo realizar el pedido</h2>
                <p className="lead">{message || 'Hubo un problema al procesar tu pedido.'}</p>
                <p>Por favor, revisa tus datos e inténtalo de nuevo.</p>
                <Link to="/checkout" className="btn btn-primary mt-3">
                    Volver a Intentar
                </Link>
            </div>
        </div>
    );
};

export default OrderErrorPage;
