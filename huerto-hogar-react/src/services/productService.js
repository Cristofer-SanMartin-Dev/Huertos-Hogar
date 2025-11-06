// src/services/productService.js
import axios from 'axios';

/**
 * TUTOR: Esta es la URL base de tu API de backend.
 * Apunta a la ruta que definimos en el @RequestMapping de tu ProductController.
 */
const BASE_URL = 'http://localhost:8080/api/products';

export const getProducts = () => products;
export const getFeaturedProducts = () => products.slice(0, 3);
