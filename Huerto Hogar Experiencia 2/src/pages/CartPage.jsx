import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';

export const CartPage = () => {
  // Obtenemos todo lo que necesitamos del contexto
  const { cart, removeFromCart, clearCart, addToCart, decreaseQuantity } = useContext(CartContext);

  // Calculamos el precio total
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="container text-center mt-5">
        <h1>Tu carrito está vacío</h1>
        <p>Parece que aún no has agregado productos.</p>
        <Link to="/" className="btn btn-primary">Volver a la tienda</Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1>Carrito de Compras</h1>
      <ul className="list-group mb-4">
        {cart.map(product => (
          <li key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
            
            <div className="d-flex align-items-center">
              <img src={product.image} alt={product.name} style={{width: '50px', marginRight: '15px'}}/>
              <div>
                <h5 className="mb-1">{product.name}</h5>
                <p className="mb-1 text-muted">${product.price} CLP c/u</p>
              </div>
            </div>

            <div className="d-flex align-items-center">
              {/* Botones para ajustar cantidad */}
              <button className="btn btn-secondary btn-sm" onClick={() => decreaseQuantity(product.id)}>-</button>
              <span className="mx-3">{product.quantity}</span>
              <button className="btn btn-secondary btn-sm" onClick={() => addToCart(product)}>+</button>
              
              <strong className="mx-4">${product.price * product.quantity} CLP</strong>

              {/* Botón para eliminar */}
              <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(product.id)}>Eliminar</button>
            </div>

          </li>
        ))}
      </ul>

      <div className="d-flex justify-content-between align-items-center">
        <h3>Total: ${totalPrice} CLP</h3>
        <div>
          <button className="btn btn-danger me-2" onClick={() => clearCart()}>Vaciar Carrito</button>
          <button className="btn btn-success">Finalizar Compra</button>
        </div>
      </div>
    </div>
  );
};