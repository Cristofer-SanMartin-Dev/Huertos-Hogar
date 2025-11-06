// src/pages/OrderSuccessPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// TUTOR: Basado en la Figura 7
const OrderSuccessPage = () => {
    return (
        <div className="container text-center py-5">
            <div className="login-container" style={{maxWidth: '600px'}}>
                <h2 className="section-title text-success">✅ ¡Pago Realizado con Éxito!</h2>
                <p className="lead">Tu pedido nro #20240705 está siendo preparado.</p>
                <p>Hemos enviado un resumen de tu compra a tu correo electrónico. Gracias por preferir HuertoHogar.</p>
                <Link to="/" className="btn btn-primary mt-3">
                    Volver al Inicio
                </Link>
            </div>
        </div>
    );
};

export default OrderSuccessPage;