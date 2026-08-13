// src/tests/ResetPasswordPage.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import ResetPasswordPage from '../pages/ResetPasswordPage.jsx';
import authService from '../services/authService.js';

vi.mock('../services/authService.js', () => ({
  default: {
    resetPassword: vi.fn(),
  },
}));

const renderConEmail = (email = 'usuario@test.cl') => render(
  <MemoryRouter initialEntries={[{ pathname: '/restablecer-contrasena', state: { email } }]}>
    <Routes>
      <Route path="/restablecer-contrasena" element={<ResetPasswordPage />} />
    </Routes>
  </MemoryRouter>
);

const renderSinEmail = () => render(
  <MemoryRouter initialEntries={['/restablecer-contrasena']}>
    <Routes>
      <Route path="/restablecer-contrasena" element={<ResetPasswordPage />} />
    </Routes>
  </MemoryRouter>
);

describe('Página ResetPasswordPage', () => {
  test('sin email en el state pide el correo también', () => {
    renderSinEmail();

    expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
  });

  test('con email en el state no vuelve a pedirlo, lo muestra como contexto', () => {
    renderConEmail('usuario@test.cl');

    expect(screen.queryByLabelText(/Correo Electrónico/i)).not.toBeInTheDocument();
    expect(screen.getByText('usuario@test.cl')).toBeInTheDocument();
  });

  test('con contraseñas que no coinciden muestra un error y no llama a la API', () => {
    renderConEmail();

    fireEvent.change(screen.getByLabelText(/^Código de verificación/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText('Contraseña nueva:'), { target: { value: 'NuevaClave123!' } });
    fireEvent.change(screen.getByLabelText('Confirmar contraseña:'), { target: { value: 'OtraClave456!' } });
    fireEvent.click(screen.getByRole('button', { name: /Restablecer contraseña/i }));

    expect(screen.getByText(/no coinciden/i)).toBeInTheDocument();
    expect(authService.resetPassword).not.toHaveBeenCalled();
  });

  test('con un código válido llama a la API con el email, el código y la contraseña nueva', async () => {
    authService.resetPassword.mockResolvedValueOnce({ data: 'ok' });
    renderConEmail('usuario@test.cl');

    fireEvent.change(screen.getByLabelText(/^Código de verificación/i), { target: { value: '482913' } });
    fireEvent.change(screen.getByLabelText('Contraseña nueva:'), { target: { value: 'NuevaClave123!' } });
    fireEvent.change(screen.getByLabelText('Confirmar contraseña:'), { target: { value: 'NuevaClave123!' } });
    fireEvent.click(screen.getByRole('button', { name: /Restablecer contraseña/i }));

    await waitFor(() =>
      expect(authService.resetPassword).toHaveBeenCalledWith('usuario@test.cl', '482913', 'NuevaClave123!')
    );
  });

  test('si el código es inválido o expiró, muestra el mensaje que devuelve el backend', async () => {
    authService.resetPassword.mockRejectedValueOnce({ response: { data: 'El código expiró. Solicita uno nuevo.' } });
    renderConEmail();

    fireEvent.change(screen.getByLabelText(/^Código de verificación/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText('Contraseña nueva:'), { target: { value: 'NuevaClave123!' } });
    fireEvent.change(screen.getByLabelText('Confirmar contraseña:'), { target: { value: 'NuevaClave123!' } });
    fireEvent.click(screen.getByRole('button', { name: /Restablecer contraseña/i }));

    expect(await screen.findByText(/El código expiró/i)).toBeInTheDocument();
  });
});
