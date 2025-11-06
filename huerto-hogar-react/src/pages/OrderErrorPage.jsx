// src/pages/OrderErrorPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// TUTOR: Basado en la Figura 8
const OrderErrorPage = () => {
    return (
        <div className="container text-center py-5">
            <div className="login-container" style={{maxWidth: '600px'}}>
                <h2 className="section-title text-danger">❌ No se pudo realizar el pago</h2>
                <p className="lead">Hubo un problema al procesar tu pago (nro #20240705).</p>
                <p>Por favor, revisa tus datos e inténtalo de nuevo. Si el problema persiste, contacta a tu banco.</p>
                <Link to="/checkout" className="btn btn-primary mt-3">
                    Volver a Intentar el Pago
                </Link>
            </div>
        </div>
    );
};

export default OrderErrorPage;