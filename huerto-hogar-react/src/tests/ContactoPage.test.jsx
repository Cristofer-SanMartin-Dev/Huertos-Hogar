// src/tests/ContactoPage.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

import ContactoPage from '../pages/ContactoPage.jsx';
import contactService from '../services/contactService.js';

vi.mock('../services/contactService.js', () => ({
  default: { send: vi.fn() },
}));

describe('Página ContactoPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('envía el formulario con los datos ingresados y muestra confirmación', async () => {
    contactService.send.mockResolvedValue({ data: {} });

    render(<ContactoPage />);

    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Ana Soto' } });
    fireEvent.change(screen.getByLabelText(/Correo/i), { target: { value: 'ana@test.cl' } });
    fireEvent.change(screen.getByLabelText(/Mensaje/i), { target: { value: 'Hola, tengo una consulta.' } });
    fireEvent.click(screen.getByRole('button', { name: /Enviar Mensaje/i }));

    await waitFor(() => {
      expect(contactService.send).toHaveBeenCalledWith({
        nombre: 'Ana Soto', email: 'ana@test.cl', mensaje: 'Hola, tengo una consulta.',
      });
    });
    expect(await screen.findByText(/Mensaje enviado/i)).toBeInTheDocument();
  });

  test('muestra un error si el envío falla', async () => {
    contactService.send.mockRejectedValue(new Error('network error'));

    render(<ContactoPage />);

    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Ana Soto' } });
    fireEvent.change(screen.getByLabelText(/Correo/i), { target: { value: 'ana@test.cl' } });
    fireEvent.change(screen.getByLabelText(/Mensaje/i), { target: { value: 'Hola' } });
    fireEvent.click(screen.getByRole('button', { name: /Enviar Mensaje/i }));

    expect(await screen.findByText(/No se pudo enviar/i)).toBeInTheDocument();
  });
});
