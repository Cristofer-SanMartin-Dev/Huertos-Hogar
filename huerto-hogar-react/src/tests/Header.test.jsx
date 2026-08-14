// src/tests/Header.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Header from '../components/Header.jsx';
// TUTOR: Importamos los contextos que acabamos de exportar.
import { CartContext } from '../context/CartContext.js';
import { AuthContext } from '../context/AuthContext.js';

describe('Componente Header', () => {
  test('muestra la cantidad de productos distintos, no la suma de unidades', () => {
    // 2 productos distintos que suman 7 unidades entre ambos: el badge debe
    // mostrar 2 (productos), no 7 (unidades) — mismo criterio que ya usa
    // el checkout ("Tu Carrito N" cuenta productos, no unidades).
    const mockCart = [
      { id: 'FR001', quantity: 2 },
      { id: 'VR001', quantity: 5 },
    ];

    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ isAuthenticated: false, logout: vi.fn() }}>
          <CartContext.Provider value={{ cart: mockCart }}>
            <Header />
          </CartContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    const cartLink = screen.getByRole('link', { name: /Carrito \(2\)/i });
    expect(cartLink).toBeInTheDocument();
  });
});