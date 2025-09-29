// src/context/CartContext.jsx
import React, { createContext, useReducer, useContext } from 'react';

// TUTOR: Hacemos el mismo cambio aquí. Añadimos 'export'.
export const CartContext = createContext();

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
        return [...state, { ...product, quantity: 1 }];
    }
    case 'INCREMENT_QUANTITY': {
        return state.map(item => {
            if (item.id === action.payload) {
                // Solo incrementa si la cantidad es menor que el stock
                if(item.quantity < item.stock) {
                    return { ...item, quantity: item.quantity + 1 };
                }
            }
            return item;
        });
    }
    case 'DECREMENT_QUANTITY': {
        return state.map(item => {
            if (item.id === action.payload) {
                // Si la cantidad es mayor que 1, la decrementamos
                if (item.quantity > 1) {
                    return { ...item, quantity: item.quantity - 1 };
                }
            }
            return item;
        }).filter(item => item.quantity > 0); // Opcional: si la cantidad llega a 0 se podría eliminar
    }
    case 'REMOVE_FROM_CART': {
        // Filtramos el array para devolver todos los items excepto el que queremos eliminar
        return state.filter(item => item.id !== action.payload);
    }
    case 'CLEAR_CART': {
        // Simplemente devolvemos un array vacío para limpiar el carrito
        return [];
    }
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
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
    alert(`${product.name} ha sido agregado al carrito.`);
  };
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
  }
  return context;
};