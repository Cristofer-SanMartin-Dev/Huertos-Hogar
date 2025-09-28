import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

export const CartPage = () => {
  const { cart, removeFromCart, clearCart, addToCart, decreaseQuantity, getCartTotal } = useContext(CartContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }
    alert('¡Gracias por tu compra! Tu pedido está siendo procesado.');
    clearCart();
    navigate('/order-success');
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <header className="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom">
        <h1 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/" className="text-decoration-none text-dark">HuertoHogar</Link>
        </h1>
        <nav className="my-2 my-md-0 mr-md-3">
          <Link className="p-2 text-dark" to="/">Inicio</Link>
          <Link className="p-2 text-dark" to="/productos">Productos</Link>
          <Link className="p-2 text-dark" to="/carrito">Carrito</Link>
          <Link className="p-2 text-dark" to="/login">Iniciar Sesión</Link>
          <Link className="p-2 text-dark d-none" to="/perfil">Mi Perfil</Link>
        </nav>
      </header>

      {/* Carrito de Compras */}
      <main>
        <h2>Tu Carrito de Compras</h2>
        <div className="mb-4">
          {cart.length === 0 ? (
            <p>Tu carrito está vacío.</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="card mb-3 p-3 d-flex flex-row align-items-center">
                <img src={item.image} alt={item.name} style={{ width: 80, height: 80, objectFit: 'cover', marginRight: 16 }} />
                <div className="flex-grow-1">
                  <h4>{item.name}</h4>
                  <p>${item.price.toLocaleString('es-CL')}</p>
                </div>
                <div className="d-flex align-items-center">
                  <button className="btn btn-outline-danger btn-sm mx-1" onClick={() => decreaseQuantity(item.id)}>-</button>
                  <span className="mx-2">{item.quantity}</span>
                  <button className="btn btn-outline-success btn-sm mx-1" onClick={() => addToCart(item)}>+</button>
                  <button className="btn btn-outline-secondary btn-sm mx-2" onClick={() => removeFromCart(item.id)}>Eliminar</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="card p-4 cart-summary mb-4">
          <h3>Resumen del Pedido</h3>
          <p>Total: <span id="cart-total">${getCartTotal().toLocaleString('es-CL')}</span></p>
          <button className="btn btn-success w-100" onClick={handleCheckout}>Finalizar Compra</button>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer mt-auto py-3 bg-dark text-white">
        <div className="container text-center">
          <p>&copy; 2025 HuertoHogar. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};