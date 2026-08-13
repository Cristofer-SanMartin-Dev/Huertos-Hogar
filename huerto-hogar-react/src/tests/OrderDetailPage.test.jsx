// src/tests/OrderDetailPage.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import OrderDetailPage from '../pages/OrderDetailPage.jsx';
import orderService from '../services/orderService.js';
import { CartProvider } from '../context/CartProvider.jsx';

vi.mock('../services/orderService.js', () => ({
  default: { getById: vi.fn() },
}));

const mockOrder = {
  id: 42,
  fecha: '2026-01-01T10:00:00',
  estado: 'ENVIADO',
  total: 3000,
  calleEnvio: 'Calle 1', regionEnvio: 'Metropolitana', comunaEnvio: 'Santiago',
  fechaEntregaPreferida: null,
  items: [{ productName: 'Manzanas', unitPrice: 1500, quantity: 2, subtotal: 3000 }],
};

const renderOrderDetail = () => render(
  <CartProvider>
    <MemoryRouter initialEntries={['/pedidos/42']}>
      <Routes>
        <Route path="/pedidos/:id" element={<OrderDetailPage />} />
      </Routes>
    </MemoryRouter>
  </CartProvider>
);

describe('Página OrderDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('muestra la boleta con los datos del pedido y resalta el estado actual en el stepper', async () => {
    orderService.getById.mockResolvedValue({ data: mockOrder });

    renderOrderDetail();

    expect(await screen.findByText('Manzanas')).toBeInTheDocument();
    // "$3.000" aparece dos veces: como subtotal del ítem y como total del pedido.
    expect(screen.getAllByText('$3.000')).toHaveLength(2);

    // El estado actual (ENVIADO) y los pasos anteriores deben marcarse en negrita.
    const estadoEnviado = screen.getByText('ENVIADO');
    expect(estadoEnviado).toHaveClass('fw-bold');
  });

  test('muestra un error si el pedido no existe o no pertenece al usuario', async () => {
    orderService.getById.mockRejectedValue({ response: { data: 'No puedes ver un pedido de otro usuario.' } });

    renderOrderDetail();

    expect(await screen.findByText(/No puedes ver un pedido/i)).toBeInTheDocument();
  });
});
