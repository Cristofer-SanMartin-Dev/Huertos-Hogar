// src/services/productService.js

/**
 * TUTOR: Este archivo simula tu base de datos o una API.
 * Contiene el array completo de tus productos. Mantener los datos aquí
 * hace que tu código sea más limpio y fácil de mantener.
 *
 * IMPORTANTE: He cambiado las rutas de las imágenes para que funcionen con Vite.
 * Debes crear una carpeta llamada `assets` dentro de tu carpeta `public`
 * y colocar todas tus imágenes de productos (`manzana.png`, `naranja.png`, etc.) allí.
 * La ruta ahora debe ser `/assets/nombre_de_la_imagen.png`.
 */
const BASE_URL = 'http://localhost:8080/api/products';

export const getProducts = () => products;
export const getFeaturedProducts = () => products.slice(0, 3);
