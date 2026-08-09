// src/tests/OfertasPage.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

import OfertasPage from '../pages/OfertasPage.jsx';
import { CartProvider } from '../context/CartContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import ProductService from '../services/productService.js';

vi.mock('../services/productService.js', () => ({
  default: { getAllProducts: vi.fn(), getImageUrl: vi.fn(() => 'placeholder.png') },
}));

const productos = [
  { id: 1, name: 'Manzanas', price: 1000, stock: 10, descuento: 20, precioConDescuento: 800 },
  { id: 2, name: 'Naranjas', price: 900, stock: 10, descuento: null },
];

describe('Página OfertasPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('solo muestra productos con descuento, con el precio original tachado', async () => {
    ProductService.getAllProducts.mockResolvedValue({ data: productos });

    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ isAuthenticated: false }}>
          <CartProvider><OfertasPage /></CartProvider>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(await screen.findByText('Manzanas')).toBeInTheDocument();
    expect(screen.queryByText('Naranjas')).not.toBeInTheDocument();
    expect(screen.getByText('$1.000')).toHaveClass('text-decoration-line-through');
    expect(screen.getByText('-20%')).toBeInTheDocument();
  });

  test('muestra un mensaje si no hay ofertas disponibles', async () => {
    ProductService.getAllProducts.mockResolvedValue({ data: [productos[1]] });

    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ isAuthenticated: false }}>
          <CartProvider><OfertasPage /></CartProvider>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(await screen.findByText(/No hay ofertas disponibles/i)).toBeInTheDocument();
  });
});
