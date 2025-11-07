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

export const getProducts = () => products;
export const getFeaturedProducts = () => products.slice(0, 3);
