// src/tests/StarRating.test.jsx

// Importa React y las herramientas de Testing Library.
import React from 'react';
import { render, screen } from '@testing-library/react';

// Importa los "matchers" adicionales como .toBeInTheDocument().
// Esto es posible gracias a nuestro archivo de configuración setup.js.
import '@testing-library/jest-dom';

// Importa el componente que vamos a probar.
import StarRating from '../components/StarRating.jsx';

// `describe` agrupa todas las pruebas relacionadas con el componente StarRating.
describe('Componente StarRating', () => {

  // `test` define un caso de prueba individual.
  test('debería mostrar 4 estrellas llenas y 1 vacía para un rating de 4.0', () => {
    // 1. Arrange (Preparar): Renderizamos el componente con un rating de 4.0.
    render(<StarRating rating={4.0} />);
    
    // 2. Assert (Afirmar): Buscamos los elementos y verificamos que el resultado sea el esperado.
    // Buscamos el texto exacto que debe renderizar el componente.
    const starContainer = screen.getByText(/★★★★☆/);
    // Verificamos que el contenedor de estrellas existe en el documento.
    expect(starContainer).toBeInTheDocument();
    
    // También verificamos que el texto del rating numérico '4.0' esté presente.
    const ratingText = screen.getByText('4.0');
    expect(ratingText).toBeInTheDocument();
  });

  // Segundo caso de prueba.
  test('debería mostrar 5 estrellas llenas para un rating de 4.8', () => {
    // 1. Arrange: Renderizamos el componente con un rating de 4.8.
    render(<StarRating rating={4.8} />);
    
    // 2. Assert: Verificamos el resultado.
    // En este caso, la lógica redondea visualmente a 5 estrellas llenas.
    const starContainer = screen.getByText(/★★★★★/);
    expect(starContainer).toBeInTheDocument();

    // Verificamos que el texto numérico '4.8' también se muestre correctamente.
    const ratingText = screen.getByText('4.8');
    expect(ratingText).toBeInTheDocument();
  });
});