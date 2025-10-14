// src/tests/Header.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Header from '../components/Header.jsx';
// TUTOR: Importamos los contextos que acabamos de exportar.
import { CartContext } from '../context/CartContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';

describe('Componente Header', () => {
  test('debería mostrar el número correcto de items en el carrito', () => {
    const mockCart = [
      { id: 'FR001', quantity: 2 },
      { id: 'VR001', quantity: 1 },
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

    const cartLink = screen.getByRole('link', { name: /Carrito \(3\)/i });
    expect(cartLink).toBeInTheDocument();
  });
});