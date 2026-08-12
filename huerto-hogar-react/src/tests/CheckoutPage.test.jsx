// src/tests/CheckoutPage.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

import CheckoutPage from '../pages/CheckoutPage.jsx';
import { CartContext } from '../context/CartContext.js';
import { AuthContext } from '../context/AuthContext.js';
import orderService from '../services/orderService.js';

vi.mock('../services/orderService.js', () => ({
  default: { create: vi.fn() },
}));

const mockUser = {
  nombre: 'Ana', apellidos: 'Soto', email: 'ana@test.cl',
  calle: 'Calle 1', region: 'Metropolitana', comuna: 'Santiago',
};

const mockCart = [{ id: 1, name: 'Manzanas', price: 1000, quantity: 2 }];

const renderCheckout = (cart = mockCart, clearCart = vi.fn()) => render(
  <MemoryRouter>
    <AuthContext.Provider value={{ user: mockUser, refreshUser: vi.fn().mockResolvedValue(mockUser) }}>
      <CartContext.Provider value={{ cart, clearCart }}>
        <CheckoutPage />
      </CartContext.Provider>
    </AuthContext.Provider>
  </MemoryRouter>
);

describe('Página CheckoutPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('crea el pedido con los productos del carrito y limpia el carrito al confirmar', async () => {
    orderService.create.mockResolvedValue({ data: { id: 42 } });
    const clearCart = vi.fn();

    renderCheckout(mockCart, clearCart);

    fireEvent.click(screen.getByRole('button', { name: /Pagar ahora/i }));

    await waitFor(() => {
      expect(orderService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          items: [{ productId: 1, cantidad: 2 }],
          calle: 'Calle 1', region: 'Metropolitana', comuna: 'Santiago',
        })
      );
    });
    expect(clearCart).toHaveBeenCalled();
  });

  test('con un producto en oferta, muestra y cobra el precio con descuento, no el de lista', () => {
    const cartConDescuento = [
      { id: 1, name: 'Naranjas', price: 1000, precioConDescuento: 850, quantity: 2 },
    ];

    renderCheckout(cartConDescuento);

    // Total real: 850 * 2 = 1700 (no 1000 * 2 = 2000, el precio de lista)
    expect(screen.getByRole('button', { name: /Pagar ahora \$1\.700/i })).toBeInTheDocument();
  });

  test('si el pedido falla (ej. stock insuficiente), no limpia el carrito', async () => {
    orderService.create.mockRejectedValue({ response: { data: 'Stock insuficiente para Manzanas.' } });
    const clearCart = vi.fn();

    renderCheckout(mockCart, clearCart);

    fireEvent.click(screen.getByRole('button', { name: /Pagar ahora/i }));

    await waitFor(() => expect(orderService.create).toHaveBeenCalled());
    expect(clearCart).not.toHaveBeenCalled();
  });
});
