import React from 'react';
import { Link } from 'react-router-dom';

export const OrderSuccessPage = () => {
  // Generamos un ID de orden falso para la simulación
  const orderId = Math.round(Math.random() * 100000);

  return (
    <div className="container text-center mt-5">
      <div className="alert alert-success" role="alert">
        <h4 className="alert-heading">¡Gracias por tu compra!</h4>
        <p>Tu pedido ha sido confirmado y está en preparación.</p>
        <hr />
        <p className="mb-0">Tu número de orden es: <strong>{orderId}</strong></p>
      </div>
      <Link to="/" className="btn btn-primary mt-3">
        Volver a la tienda
      </Link>
    </div>
  );
};