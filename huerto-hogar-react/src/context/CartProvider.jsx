// Ruta: src/context/CartProvider.jsx
import React, { useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';
import { CartContext } from './CartContext.js';

const CART_STORAGE_KEY = 'cart';

// Sin esto, el carrito se pierde en cada recarga de página porque solo
// vivía en memoria (useReducer sin respaldo).
const loadInitialCart = () => {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

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
    case 'ADD_TO_CART_QUANTITY': {
      const { product, quantity } = action.payload;
      const existingItem = state.find(item => item.id === product.id);
      const cantidadActual = existingItem ? existingItem.quantity : 0;
      const cantidadFinal = Math.min(cantidadActual + quantity, product.stock);
      if (cantidadFinal <= cantidadActual) return state;
      if (existingItem) {
        return state.map(item => item.id === product.id ? { ...item, quantity: cantidadFinal } : item);
      }
      return [...state, { ...product, quantity: cantidadFinal }];
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
  const [cart, dispatch] = useReducer(cartReducer, undefined, loadInitialCart);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    // Antes esto fallaba en silencio si ya se había alcanzado el stock
    // disponible; ahora se avisa por qué no se agregó más.
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem && existingItem.quantity >= product.stock) {
      toast.warning(`No queda más stock disponible de ${product.name}.`);
      return;
    }
    dispatch({ type: 'ADD_TO_CART', payload: product });
    toast.success(`${product.name} se agregó al carrito.`);
  };
  // Igual que addToCart, pero suma una cantidad exacta de una vez y sin
  // toast propio: lo usa "Repetir pedido" para no mostrar un aviso por
  // cada unidad agregada.
  const addToCartQuantity = (product, quantity) => {
    dispatch({ type: 'ADD_TO_CART_QUANTITY', payload: { product, quantity } });
  };
  const incrementQuantity = (productId) => dispatch({ type: 'INCREMENT_QUANTITY', payload: productId });
  const decrementQuantity = (productId) => dispatch({ type: 'DECREMENT_QUANTITY', payload: productId });
  const removeFromCart = (productId) => dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const value = {
    cart,
    addToCart,
    addToCartQuantity,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
