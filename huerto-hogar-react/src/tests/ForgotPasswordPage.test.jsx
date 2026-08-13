// src/tests/ForgotPasswordPage.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import ForgotPasswordPage from '../pages/ForgotPasswordPage.jsx';
import authService from '../services/authService.js';

vi.mock('../services/authService.js', () => ({
  default: {
    forgotPassword: vi.fn(),
  },
}));

const renderForgotPassword = () => render(
  <MemoryRouter initialEntries={['/olvide-password']}>
    <Routes>
      <Route path="/olvide-password" element={<ForgotPasswordPage />} />
      <Route path="/restablecer-contrasena" element={<div>Pantalla de código</div>} />
    </Routes>
  </MemoryRouter>
);

describe('Página ForgotPasswordPage', () => {
  test('con un correo inválido muestra un error y no llama a la API', () => {
    renderForgotPassword();

    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'no-es-un-correo' } });
    fireEvent.click(screen.getByRole('button', { name: /Enviar código de verificación/i }));

    expect(screen.getByText(/Ingresa un correo electrónico válido/i)).toBeInTheDocument();
    expect(authService.forgotPassword).not.toHaveBeenCalled();
  });

  test('con un correo válido llama a la API y avanza a la pantalla de ingresar el código', async () => {
    authService.forgotPassword.mockResolvedValueOnce({ data: 'ok' });

    renderForgotPassword();

    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'usuario@test.cl' } });
    fireEvent.click(screen.getByRole('button', { name: /Enviar código de verificación/i }));

    await waitFor(() => expect(authService.forgotPassword).toHaveBeenCalledWith('usuario@test.cl'));
    expect(await screen.findByText(/Pantalla de código/i)).toBeInTheDocument();
  });
});
