// src/tests/LoginPage.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage.jsx';
// TUTOR: Importamos el contexto que acabamos de exportar.
import { AuthContext } from '../context/AuthContext.jsx';

describe('Página LoginPage', () => {
  test('debería mostrar un mensaje de error con credenciales incorrectas', () => {
    const mockLogin = vi.fn(() => false);

    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ login: mockLogin }}>
          <LoginPage />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Ingresar/i }));
    expect(screen.getByText('Correo o contraseña incorrectos.')).toBeInTheDocument();
  });

  test('debería llamar a la función login con el email y password del formulario', () => {
    const mockLogin = vi.fn();

    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ login: mockLogin }}>
          <LoginPage />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Ingresar/i }));

    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });
});