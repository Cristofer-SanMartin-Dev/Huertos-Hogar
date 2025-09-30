// src/services/productService.js

/**
 * TUTOR: Esta es tu base de datos simulada (un archivo JavaScript).
 * Cumple con el requisito de la evaluación de tener una "fuente de datos simulada".
 * Contiene el array completo de tus productos.
 */
export const products = [
    {
        id: 'FR001',
        name: 'Manzanas Fuji',
        price: 1200,
        priceUnit: 'por kilo',
        description: 'Crujientes y dulces, perfectas para meriendas saludables.',
        stock: 150,
        category: 'Frutas Frescas',
        imageUrl: '/assets/manzana.png',
        rating: 4.5,
        origin: 'Valle del Maule',
        sustainability: 'Cultivo con prácticas de agricultura integrada.',
        recipes: ['Tarta de Manzana', 'Ensalada Waldorf'],
        reviews: [
            { user: 'Ana Pérez', date: '2025-08-20', comment: '¡Deliciosas y muy frescas!' },
            { user: 'Carlos Soto', date: '2025-08-18', comment: 'Llegaron en perfecto estado.' }
        ]
    },
    {
        id: 'FR002',
        name: 'Naranjas Valencia',
        price: 1000,
        priceUnit: 'por kilo',
        description: 'Jugosas y ricas en vitamina C, ideales para zumos.',
        stock: 200,
        category: 'Frutas Frescas',
        imageUrl: '/assets/naranja.png',
        rating: 4.8,
        origin: 'Región de Valparaíso',
        sustainability: 'Riego por goteo.',
        recipes: ['Jugo de Naranja', 'Queque de Naranja'],
        reviews: [
            { user: 'Laura Mena', date: '2025-08-22', comment: 'Perfectas para hacer jugo.' }
        ]
    },
    {
        id: 'FR003',
        name: 'Plátanos Cavendish',
        price: 800,
        priceUnit: 'por kilo',
        description: 'Plátanos maduros y dulces, perfectos como snack.',
        stock: 250,
        category: 'Frutas Frescas',
        imageUrl: '/assets/platano.png',
        rating: 4.6,
        origin: 'Importado de Ecuador',
        sustainability: 'Comercio Justo.',
        recipes: ['Batido de Plátano', 'Pan de Plátano'],
        reviews: [
            { user: 'Jorge Torres', date: '2025-09-01', comment: 'Muy buen sabor.'}
        ]
    },
    {
        id: 'VR001',
        name: 'Zanahorias Orgánicas',
        price: 900,
        priceUnit: 'por kilo',
        description: 'Zanahorias crujientes cultivadas sin pesticidas.',
        stock: 100,
        category: 'Verduras Orgánicas',
        imageUrl: '/assets/zanahoria.png',
        rating: 4.2,
        origin: 'Región de O\'Higgins',
        sustainability: 'Cultivo 100% orgánico certificado.',
        recipes: ['Crema de Zanahoria', 'Jugo detox'],
        reviews: [
            { user: 'Elena M.', date: '2025-09-02', comment: 'Muy frescas y crujientes.' }
        ]
    },
     {
        id: 'VR002',
        name: 'Espinacas Frescas',
        price: 700,
        priceUnit: 'por bolsa de 500g',
        description: 'Espinacas frescas y nutritivas, perfectas para ensaladas.',
        stock: 80,
        category: 'Verduras Orgánicas',
        imageUrl: '/assets/espinacas.png',
        rating: 4.4,
        origin: 'Valle de Aconcagua',
        sustainability: 'Cultivo hidropónico.',
        recipes: ['Batido Verde', 'Ensalada de Espinacas'],
        reviews: [
            { user: 'Mónica Salas', date: '2025-09-03', comment: 'Se nota la frescura.'}
        ]
    },
    {
        id: 'PO001',
        name: 'Miel Orgánica',
        price: 5000,
        priceUnit: 'por frasco de 500g',
        description: 'Miel pura y orgánica producida por apicultores locales.',
        stock: 50,
        category: 'Productos Orgánicos',
        imageUrl: '/assets/miel.png',
        rating: 5.0,
        origin: 'Región de la Araucanía',
        sustainability: 'Apicultura sostenible.',
        recipes: ['Endulzante para té', 'Aderezo para ensaladas'],
        reviews: [
            { user: 'Roberto Díaz', date: '2025-08-25', comment: 'Calidad excepcional.' }
        ]
    }
    // ... (puedes agregar más productos si lo deseas)
];

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