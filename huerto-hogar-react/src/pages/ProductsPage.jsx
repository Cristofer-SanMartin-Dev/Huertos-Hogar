// src/pages/ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';

/**
 * TUTOR: Esta es la página del catálogo, ahora con lógica de estado y efectos.
 * - useState: Manejamos 4 piezas de estado:
 * 1. `products`: La lista original y completa de productos que no cambia.
 * 2. `filteredProducts`: La lista que se muestra en pantalla y que cambia con los filtros.
 * 3. `searchTerm`: El texto actual en la barra de búsqueda.
 * 4. `selectedCategory`: La categoría seleccionada en el dropdown.
 *
 * - useEffect: Usamos dos efectos.
 * 1. El primer `useEffect` (con `[]`) se ejecuta solo una vez para cargar todos los productos
 * del servicio y guardarlos en el estado `products`.
 * 2. El segundo `useEffect` es la clave de la reactividad. Se ejecuta CADA VEZ que
 * `searchTerm` o `selectedCategory` cambian. Dentro, filtra la lista original de `products`
 * y actualiza el estado `filteredProducts`, lo que causa que la UI se vuelva a renderizar
 * mostrando solo los productos correctos.
 */
const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Efecto para cargar los productos una sola vez al montar el componente
  useEffect(() => {
    const allProducts = getProducts();
    setProducts(allProducts);
    setFilteredProducts(allProducts);
  }, []);

  // Efecto para aplicar los filtros cada vez que el término de búsqueda o la categoría cambian
  useEffect(() => {
    let result = products;

    // 1. Filtrar por término de búsqueda (insensible a mayúsculas/minúsculas)
    if (searchTerm) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Filtrar por categoría
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]);
  
  // Extraemos las categorías únicas de la lista de productos para pasarlas al SearchBar
  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4" style={{ fontFamily: 'var(--font-header)', color: 'var(--accent-brown)' }}>
        Nuestro Catálogo
      </h2>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="col-12 text-center text-muted">No se encontraron productos que coincidan con tu búsqueda.</p>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;