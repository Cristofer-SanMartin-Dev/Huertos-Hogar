// src/tests/SearchBar.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import SearchBar from '../components/SearchBar.jsx';

describe('Componente SearchBar', () => {
  // Prueba 1: Simula escribir en el campo de búsqueda.
  test('debería llamar a onSearchChange cuando el usuario escribe en el input', () => {
    // 1. Arrange (Preparar): Creamos una función espía (mock) con vi.fn().
    const handleSearchChange = vi.fn();
    
    // Renderizamos el componente, pasándole la función espía como prop.
    render(<SearchBar onSearchChange={handleSearchChange} categories={[]} />);
    
    // Buscamos el input por su texto de placeholder.
    const searchInput = screen.getByPlaceholderText(/Buscar productos por nombre.../i);

    // 2. Act (Actuar): Simulamos que el usuario escribe "manzana" en el input.
    fireEvent.change(searchInput, { target: { value: 'manzana' } });

    // 3. Assert (Afirmar): Verificamos que nuestra función espía fue llamada con el valor correcto.
    expect(handleSearchChange).toHaveBeenCalledWith('manzana');
  });

  // Prueba 2: Simula cambiar la categoría en el dropdown.
  test('debería llamar a onCategoryChange cuando el usuario selecciona una categoría', () => {
    const handleCategoryChange = vi.fn();
    const categories = ['Frutas Frescas', 'Verduras Orgánicas'];
    
    render(<SearchBar onCategoryChange={handleCategoryChange} categories={categories} />);
    
    // Buscamos el dropdown por su rol.
    const categorySelect = screen.getByRole('combobox');

    // Act: Simulamos que el usuario selecciona la opción "Frutas Frescas".
    fireEvent.change(categorySelect, { target: { value: 'Frutas Frescas' } });

    // Assert: Verificamos que la función fue llamada con el valor seleccionado.
    expect(handleCategoryChange).toHaveBeenCalledWith('Frutas Frescas');
  });
});