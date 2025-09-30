// src/services/productService.js

/**
 * TUTOR: Esta es la versión final de tu base de datos simulada.
 * Todos los productos han sido enriquecidos con las propiedades:
 * - `priceUnit`: Especifica si el precio es por kilo, unidad, etc.
 * - `origin`: Indica el lugar de origen del producto.
 * - `sustainability`: Describe las prácticas sostenibles asociadas.
 * - `recipes`: Un array con ideas de recetas.
 */
const BASE_URL = 'http://localhost:8080/api/products';

/**
 * TUTOR: Esta es la función que `ProductsPage.jsx` está buscando.
 * Exporta directamente la lista completa de productos.
 */
export const getProducts = () => {
    return products;
};

/**
 * TUTOR: Esta es la función que `HomePage.jsx` está buscando.
 * Exporta solo los 3 primeros productos para la sección "destacados".
 */
export const getFeaturedProducts = () => {
    return products.slice(0, 3);
};
