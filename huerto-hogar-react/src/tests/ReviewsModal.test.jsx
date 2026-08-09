// src/tests/ReviewsModal.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

import ReviewsModal from '../components/ReviewsModal.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import reviewService from '../services/reviewService.js';

vi.mock('../services/reviewService.js', () => ({
  default: {
    getByProduct: vi.fn(),
    create: vi.fn(),
  },
}));

const mockProduct = { id: 1, name: 'Manzanas Fuji', averageRating: 4.5 };

const renderModal = (authValue, props = {}) => render(
  <MemoryRouter>
    <AuthContext.Provider value={authValue}>
      <ReviewsModal product={mockProduct} show={true} onClose={vi.fn()} {...props} />
    </AuthContext.Provider>
  </MemoryRouter>
);

describe('Componente ReviewsModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    reviewService.getByProduct.mockResolvedValue({ data: [] });
  });

  test('carga y muestra las reseñas reales del producto al abrir', async () => {
    reviewService.getByProduct.mockResolvedValue({
      data: [{ id: 1, rating: 5, comment: 'Excelente producto', authorName: 'Ana Perez', createdAt: '2026-01-01T00:00:00' }],
    });

    renderModal({ isAuthenticated: false });

    expect(await screen.findByText('Excelente producto')).toBeInTheDocument();
    expect(screen.getByText('Ana Perez')).toBeInTheDocument();
    expect(reviewService.getByProduct).toHaveBeenCalledWith(1);
  });

  test('si no hay sesión iniciada, invita a iniciar sesión en vez de mostrar el formulario', async () => {
    renderModal({ isAuthenticated: false });

    expect(await screen.findByText(/Inicia sesión/i)).toBeInTheDocument();
    expect(screen.queryByText('Enviar Reseña')).not.toBeInTheDocument();
  });

  test('con sesión iniciada, publica una reseña con la calificación y el comentario', async () => {
    reviewService.create.mockResolvedValue({
      data: { id: 2, rating: 4, comment: 'Muy bueno', authorName: 'Yo', createdAt: '2026-01-02T00:00:00' },
    });

    renderModal({ isAuthenticated: true });

    await waitFor(() => expect(reviewService.getByProduct).toHaveBeenCalled());

    fireEvent.click(screen.getByRole('radio', { name: '4 estrellas' }));
    fireEvent.change(screen.getByPlaceholderText(/Escribe tu opinión/i), { target: { value: 'Muy bueno' } });
    fireEvent.click(screen.getByText('Enviar Reseña'));

    await waitFor(() => {
      expect(reviewService.create).toHaveBeenCalledWith(1, { rating: 4, comment: 'Muy bueno' });
    });
  });
});
