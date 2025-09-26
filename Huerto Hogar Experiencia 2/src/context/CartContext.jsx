import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // --- FUNCIÓN PARA AÑADIR AL CARRITO (MEJORADA) ---
  const addToCart = (product) => {
    setCart(currentCart => {
      const productExists = currentCart.find(item => item.id === product.id);
      if (productExists) {
        return currentCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...currentCart, { ...product, quantity: 1 }];
      }
    });
  };

  // --- NUEVA FUNCIÓN: ELIMINAR UN PRODUCTO DEL CARRITO ---
  const removeFromCart = (productId) => {
    setCart(currentCart => {
      return currentCart.filter(item => item.id !== productId);
    });
  };

  // --- NUEVA FUNCIÓN: VACIAR TODO EL CARRITO ---
  const clearCart = () => {
    setCart([]);
  };

  // --- NUEVA FUNCIÓN: DECREMENTAR LA CANTIDAD ---
  const decreaseQuantity = (productId) => {
    setCart(currentCart => {
      return currentCart.map(item => {
        if (item.id === productId) {
          // Si la cantidad es mayor que 1, la decrementa. Si no, no cambia.
          const newQuantity = item.quantity > 1 ? item.quantity - 1 : 1;
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  // El objeto 'value' que proveeremos a los componentes
  const value = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    decreaseQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};