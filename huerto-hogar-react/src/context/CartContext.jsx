// src/context/CartContext.jsx
import React, { createContext, useReducer, useContext } from 'react';

<<<<<<< HEAD
// TUTOR: Hacemos el mismo cambio aquí. Añadimos 'export'.
export const CartContext = createContext();

=======
// 1. Creamos el Contexto
const CartContext = createContext();

// 2. Definimos el Reducer del Carrito
>>>>>>> 147913b (Estado Global del Carrito con Context API)
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const product = action.payload;
      const existingItem = state.find(item => item.id === product.id);
<<<<<<< HEAD
=======

>>>>>>> 147913b (Estado Global del Carrito con Context API)
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          return state.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return state;
      }
      return [...state, { ...product, quantity: 1 }];
    }
<<<<<<< HEAD
    case 'INCREMENT_QUANTITY': {
      return state.map(item => {
        if (item.id === action.payload && item.quantity < item.stock) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
    }
    case 'DECREMENT_QUANTITY': {
      const itemToDecrement = state.find(item => item.id === action.payload);
      if (itemToDecrement && itemToDecrement.quantity === 1) {
        return state.filter(item => item.id !== action.payload);
      }
      return state.map(item =>
        item.id === action.payload ? { ...item, quantity: item.quantity - 1 } : item
      );
    }
    case 'REMOVE_FROM_CART': {
      return state.filter(item => item.id !== action.payload);
    }
    case 'CLEAR_CART': {
      return [];
    }
=======
>>>>>>> 147913b (Estado Global del Carrito con Context API)
    default:
      return state;
  }
};

<<<<<<< HEAD
export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);
=======
// 3. Creamos el Componente Proveedor (Provider)
export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

>>>>>>> 147913b (Estado Global del Carrito con Context API)
  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
    alert(`${product.name} ha sido agregado al carrito.`);
  };
<<<<<<< HEAD
  const incrementQuantity = (productId) => dispatch({ type: 'INCREMENT_QUANTITY', payload: productId });
  const decrementQuantity = (productId) => dispatch({ type: 'DECREMENT_QUANTITY', payload: productId });
  const removeFromCart = (productId) => dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const value = { cart, addToCart, incrementQuantity, decrementQuantity, removeFromCart, clearCart };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
=======

  const value = {
    cart,
    addToCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// 4. Creamos un Hook Personalizado (Custom Hook)
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
>>>>>>> 147913b (Estado Global del Carrito con Context API)
  }
  return context;
};