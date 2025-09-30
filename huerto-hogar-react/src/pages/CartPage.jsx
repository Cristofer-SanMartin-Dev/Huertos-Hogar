// src/pages/CartPage.jsx
import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import { Link } from 'react-router-dom';
// 1. Importa el nuevo componente
import ImpactoAmbiental from '../components/ImpactoAmbiental.jsx';

const CartPage = () => {
    // Obtenemos todo lo necesario del contexto del carrito
    const { cart, removeFromCart, incrementQuantity, decrementQuantity, clearCart } = useCart();
    
    // Calculamos el total
    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    // Si el carrito está vacío, muestra el mensaje
    if (cart.length === 0) {
        return (
            <div className="container text-center py-5">
                <h2 className="section-title">Tu Carrito está Vacío</h2>
                <p className="lead text-muted">Parece que aún no has agregado productos.</p>
                <Link to="/productos" className="btn btn-primary mt-3">
                    Ver Catálogo de Productos
                </Link>
            </div>
        );
    }

    // Si el carrito NO está vacío, muestra la lista y el resumen
    return (
        <div className="container py-5">
            <h2 className="mb-4 section-title">Tu Carrito de Compras</h2>
            <div className="row">
                
                {/* Columna de la lista de productos */}
                <div className="col-lg-8">
                    {/* TUTOR: Aquí está la lógica que renderiza la lista. */}
                    {/* Mapeamos el array 'cart' que viene del contexto. */}
                    {cart.map(item => (
                        <div key={item.id} className="card mb-3">
                            <div className="row g-0">
                                <div className="col-md-2 d-flex align-items-center justify-content-center p-2">
                                    <img src={item.imageUrl} className="img-fluid rounded-start cart-item-img" alt={item.name} />
                                </div>
                                <div className="col-md-10">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between">
                                            <h5 className="product-title">{item.name}</h5>
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

                {/* Columna del Resumen del Pedido */}
                <div className="col-lg-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title product-title">Resumen del Pedido</h5>
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
                            <ImpactoAmbiental cart={cart} />
                            
                            <div className="d-grid gap-2 mt-3">
                                <Link to="/checkout" className="btn btn-success">
                                    Finalizar Compra
                                </Link>
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
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4" style={{ fontFamily: 'var(--font-header)', color: 'var(--accent-brown)' }}>Tu Carrito de Compras</h2>
      <div className="row">
        <div className="col-lg-8">
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

              {/* 2. Añadimos el componente de impacto ambiental aquí */}
              <ImpactoAmbiental cart={cart} />

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