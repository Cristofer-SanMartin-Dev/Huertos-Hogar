// src/tests/LoginPage.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage.jsx';
// TUTOR: Importamos el contexto que acabamos de exportar.
import { AuthContext } from '../context/AuthContext.js';

describe('Página LoginPage', () => {
  // El login llama a la API y devuelve una Promesa, así que el mock debe
  // devolver una promesa rechazada para simular credenciales incorrectas.
  test('debería mostrar un mensaje de error con credenciales incorrectas', async () => {
    const mockLogin = vi.fn(() =>
      Promise.reject({ response: { data: 'Correo o contraseña incorrectos.' } })
    );

    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ login: mockLogin }}>
          <LoginPage />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Ingresar/i }));
    expect(await screen.findByText('Correo o contraseña incorrectos.')).toBeInTheDocument();
  });

  test('debería llamar a la función login con el email y password del formulario', () => {
    const mockLogin = vi.fn(() => Promise.resolve({ role: 'CUSTOMER' }));

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