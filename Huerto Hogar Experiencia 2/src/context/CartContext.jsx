import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Recupera el carrito de localStorage al iniciar
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    // Guarda el carrito en localStorage cada vez que cambie
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Añadir al carrito con validación de stock
  const addToCart = (product) => {
    setCart(currentCart => {
      const productExists = currentCart.find(item => item.id === product.id);
      if (productExists) {
        // Validar stock
        if (productExists.quantity < product.stock) {
          return currentCart.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          alert('No puedes agregar más de este producto. ¡Stock máximo alcanzado!');
          return currentCart;
        }
      } else {
        return [...currentCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Eliminar producto del carrito
  const removeFromCart = (productId) => {
    setCart(currentCart => currentCart.filter(item => item.id !== productId));
  };

  // Vaciar carrito
  const clearCart = () => {
    setCart([]);
  };

  // Decrementar cantidad
  const decreaseQuantity = (productId) => {
    setCart(currentCart => {
      return currentCart.map(item => {
        if (item.id === productId) {
          return item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  // Calcular total
  const getCartTotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  // Calcular cantidad total
  const getCartCount = () => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    decreaseQuantity,
    getCartTotal,
    getCartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};