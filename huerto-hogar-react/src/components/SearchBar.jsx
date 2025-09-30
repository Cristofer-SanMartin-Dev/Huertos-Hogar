// src/components/SearchBar.jsx
import React from 'react';

/**
 * TUTOR: Este es un "componente controlado".
 * No maneja su propio estado. En su lugar, recibe los valores actuales
 * (`searchTerm`, `selectedCategory`) y las funciones para cambiarlos
 * (`onSearchChange`, `onCategoryChange`) como props desde su componente padre (ProductsPage).
 * Esto centraliza el estado en un solo lugar, haciendo la aplicación más predecible y fácil de depurar.
 * También le pasamos las categorías para que las muestre dinámicamente en el dropdown.
 */
const SearchBar = ({ searchTerm, onSearchChange, selectedCategory, onCategoryChange, categories }) => {
  return (
    <div className="row mb-4 justify-content-center">
      <div className="col-md-6">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar productos por nombre..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="col-md-4">
        <select
          className="form-select"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="all">Todas las categorías</option>
          {/* Mapeamos las categorías para crear las opciones dinámicamente */}
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchBar;