// src/pages/OrderSuccessPage.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const OrderSuccessPage = () => {
    const location = useLocation();
    const orderId = location.state?.orderId;

    return (
        <div className="container text-center py-5">
            <div className="login-container" style={{maxWidth: '600px'}}>
                <h2 className="section-title text-success">✅ ¡Pago Realizado con Éxito!</h2>
                {orderId ? (
                    <p className="lead">Tu pedido nro #{orderId} está siendo preparado.</p>
                ) : (
                    <p className="lead">Tu pedido está siendo preparado.</p>
                )}
                <p>Gracias por preferir HuertoHogar.</p>
                {orderId && (
                    <Link to={`/pedidos/${orderId}`} className="btn btn-outline-primary mt-3 me-2">
                        Ver mi pedido
                    </Link>
                )}
                <Link to="/" className="btn btn-primary mt-3">
                    Volver al Inicio
                </Link>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
