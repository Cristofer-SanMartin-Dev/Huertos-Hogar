// src/context/CartContext.jsx
import React, { createContext, useReducer, useContext } from 'react';

// 1. Creamos el Contexto
const CartContext = createContext();

// 2. Definimos el Reducer del Carrito
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const product = action.payload;
      const existingItem = state.find(item => item.id === product.id);

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
    default:
      return state;
  }
};

// 3. Creamos el Componente Proveedor (Provider)
export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
    alert(`${product.name} ha sido agregado al carrito.`);
  };

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
  }
  return context;
};