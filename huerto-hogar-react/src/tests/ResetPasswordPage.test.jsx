// src/tests/ResetPasswordPage.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

import ResetPasswordPage from '../pages/ResetPasswordPage.jsx';
import authService from '../services/authService.js';

vi.mock('../services/authService.js', () => ({
  default: {
    resetPassword: vi.fn(),
  },
}));

const renderConToken = (token = 'token-de-prueba') => render(
  <MemoryRouter initialEntries={[`/restablecer-contrasena?token=${token}`]}>
    <ResetPasswordPage />
  </MemoryRouter>
);

describe('Página ResetPasswordPage', () => {
  test('sin token en la URL muestra que el enlace no es válido', () => {
    render(
      <MemoryRouter initialEntries={['/restablecer-contrasena']}>
        <ResetPasswordPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Enlace inválido/i)).toBeInTheDocument();
    expect(authService.resetPassword).not.toHaveBeenCalled();
  });

  test('con contraseñas que no coinciden muestra un error y no llama a la API', () => {
    renderConToken();

    fireEvent.change(screen.getByLabelText(/Contraseña nueva/i), { target: { value: 'NuevaClave123!' } });
    fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i), { target: { value: 'OtraClave456!' } });
    fireEvent.click(screen.getByRole('button', { name: /Restablecer contraseña/i }));

    expect(screen.getByText(/no coinciden/i)).toBeInTheDocument();
    expect(authService.resetPassword).not.toHaveBeenCalled();
  });

  test('con una contraseña válida llama a la API con el token de la URL', async () => {
    authService.resetPassword.mockResolvedValueOnce({ data: 'ok' });
    renderConToken('abc123');

    fireEvent.change(screen.getByLabelText(/Contraseña nueva/i), { target: { value: 'NuevaClave123!' } });
    fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i), { target: { value: 'NuevaClave123!' } });
    fireEvent.click(screen.getByRole('button', { name: /Restablecer contraseña/i }));

    await waitFor(() =>
      expect(authService.resetPassword).toHaveBeenCalledWith('abc123', 'NuevaClave123!')
    );
  });

  test('si el token es inválido o expiró, muestra el mensaje que devuelve el backend', async () => {
    authService.resetPassword.mockRejectedValueOnce({ response: { data: 'El enlace de recuperación expiró. Solicita uno nuevo.' } });
    renderConToken();

    fireEvent.change(screen.getByLabelText(/Contraseña nueva/i), { target: { value: 'NuevaClave123!' } });
    fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i), { target: { value: 'NuevaClave123!' } });
    fireEvent.click(screen.getByRole('button', { name: /Restablecer contraseña/i }));

    expect(await screen.findByText(/El enlace de recuperación expiró/i)).toBeInTheDocument();
  });
});
