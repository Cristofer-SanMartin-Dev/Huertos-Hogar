// src/pages/CartPage.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

/**
 * TUTOR: Este componente construye la página del carrito.
 * - `useCart()`: Obtenemos todo lo que necesitamos del contexto global:
 * - `cart`: El array de productos en el carrito.
 * - `removeFromCart`, `incrementQuantity`, `decrementQuantity`, `clearCart`: Las funciones para modificar el carrito.
 * - Renderizado Condicional: Mostramos un mensaje si el carrito está vacío, o la tabla de productos si tiene items.
 * - `reduce()`: Usamos este método para calcular el `cartTotal`, sumando el precio por la cantidad de cada item.
 * - Funcionalidad: Los botones de "+", "-", y "Eliminar" están conectados directamente a las funciones del contexto.
 * Cualquier cambio que se haga aquí se reflejará inmediatamente en el Header y en cualquier otro
 * componente que consuma el `useCart` hook.
 */
const CartPage = () => {
  const { cart, removeFromCart, incrementQuantity, decrementQuantity, clearCart } = useCart();

  // Calcula el total del carrito
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Si el carrito está vacío, muestra un mensaje amigable
  if (cart.length === 0) {
    return (
      <div className="container text-center py-5">
        <h2 style={{ fontFamily: 'var(--font-header)', color: 'var(--accent-brown)' }}>Tu Carrito está Vacío</h2>
        <p className="lead text-muted">Parece que aún no has agregado productos.</p>
        <Link to="/productos" className="btn btn-primary mt-3">
          Ver Catálogo de Productos
        </Link>
      </div>
    );
  }

  // Si hay productos, muestra la tabla y el resumen
  return (
    <div className="container py-5">
      <h2 className="mb-4" style={{ fontFamily: 'var(--font-header)', color: 'var(--accent-brown)' }}>Tu Carrito de Compras</h2>
      <div className="row">
        <div className="col-lg-8">
          {/* Lista de productos en el carrito */}
          {cart.map(item => (
            <div key={item.id} className="card mb-3">
              <div className="row g-0">
                <div className="col-md-2 d-flex align-items-center justify-content-center">
                  <img src={item.imageUrl} className="img-fluid rounded-start" alt={item.name} style={{ maxHeight: '100px', width: 'auto' }} />
                </div>
                <div className="col-md-10">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <h5 className="card-title">{item.name}</h5>
                      <button onClick={() => removeFromCart(item.id)} className="btn-close" aria-label="Close"></button>
                    </div>
                    <p className="card-text">
                      <strong>Precio: ${item.price.toLocaleString('es-CL')}</strong>
                    </p>
                    <div className="d-flex align-items-center">
                      <p className="card-text mb-0 me-3">Cantidad:</p>
                      <div className="btn-group" role="group">
                        <button type="button" onClick={() => decrementQuantity(item.id)} className="btn btn-outline-secondary">-</button>
                        <button type="button" className="btn btn-light" disabled>{item.quantity}</button>
                        <button type="button" onClick={() => incrementQuantity(item.id)} className="btn btn-outline-secondary">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen del pedido */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title" style={{ fontFamily: 'var(--font-header)' }}>Resumen del Pedido</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Subtotal
                  <span>${cartTotal.toLocaleString('es-CL')}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center fw-bold">
                  Total a Pagar
                  <span>${cartTotal.toLocaleString('es-CL')}</span>
                </li>
              </ul>
              <div className="d-grid gap-2 mt-3">
                <button onClick={clearCart} className="btn btn-success">
                  Finalizar Compra
                </button>
                <button onClick={clearCart} className="btn btn-outline-danger">
                  Vaciar Carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;