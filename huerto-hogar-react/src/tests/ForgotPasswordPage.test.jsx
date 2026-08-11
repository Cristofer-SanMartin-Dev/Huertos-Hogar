// src/tests/ForgotPasswordPage.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

import ForgotPasswordPage from '../pages/ForgotPasswordPage.jsx';
import authService from '../services/authService.js';

vi.mock('../services/authService.js', () => ({
  default: {
    forgotPassword: vi.fn(),
  },
}));

describe('Página ForgotPasswordPage', () => {
  test('con un correo inválido muestra un error y no llama a la API', () => {
    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'no-es-un-correo' } });
    fireEvent.click(screen.getByRole('button', { name: /Enviar enlace de recuperación/i }));

    expect(screen.getByText(/Ingresa un correo electrónico válido/i)).toBeInTheDocument();
    expect(authService.forgotPassword).not.toHaveBeenCalled();
  });

  test('con un correo válido llama a la API y muestra el mensaje de confirmación', async () => {
    authService.forgotPassword.mockResolvedValueOnce({ data: 'ok' });

    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'usuario@test.cl' } });
    fireEvent.click(screen.getByRole('button', { name: /Enviar enlace de recuperación/i }));

    await waitFor(() => expect(authService.forgotPassword).toHaveBeenCalledWith('usuario@test.cl'));
    expect(await screen.findByText(/te enviamos un enlace/i)).toBeInTheDocument();
  });
});
