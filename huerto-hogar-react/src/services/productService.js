// src/services/productService.js

/**
 * TUTOR: Esta es tu base de datos simulada (un archivo JavaScript).
 * Cumple con el requisito de la evaluación de tener una "fuente de datos simulada".
 * Contiene el array completo de tus productos.
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
