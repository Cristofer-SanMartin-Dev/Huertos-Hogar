// src/tests/ProductCard.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import ProductCard from '../components/ProductCard.jsx';
import { CartProvider } from '../context/CartContext.jsx';

const mockProduct = {
  id: 'TEST001', name: 'Producto de Prueba', price: 1500, priceUnit: 'por unidad',
  stock: 5, rating: 3.5, recipes: [], reviews: []
};

describe('Componente ProductCard', () => {

  test('debería renderizar el nombre y el precio del producto', () => {
    render(<CartProvider><ProductCard product={mockProduct} /></CartProvider>);

    expect(screen.getByText('Producto de Prueba')).toBeInTheDocument();
    
    // TUTOR: AQUÍ ESTÁ LA CORRECCIÓN.
    // Cambiamos la coma (,) por un punto (.) para que coincida con el formato de 'es-CL'.
    expect(screen.getByText('$1.500')).toBeInTheDocument();
  });

  test('debería llamar a la función onViewReviews cuando se hace clic', () => {
    const mockOnViewReviews = vi.fn();
    render(<CartProvider><ProductCard product={mockProduct} onViewReviews={mockOnViewReviews} /></CartProvider>);
    const detailsButton = screen.getByRole('button', { name: /Ver Detalles y Reseñas/i });
    fireEvent.click(detailsButton);
    expect(mockOnViewReviews).toHaveBeenCalledWith(mockProduct);
  });

  test('el botón "Agregar" debería estar deshabilitado si el stock es 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    render(<CartProvider><ProductCard product={outOfStockProduct} /></CartProvider>);
    const addButton = screen.getByRole('button', { name: /No disponible/i });
    expect(addButton).toBeDisabled();
  });
});