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
export const products = [
    {
        id: 'FR001',
        name: 'Manzanas Fuji',
        price: 1200,
        description: 'Crujientes y dulces, cultivadas en el Valle del Maule. Perfectas para meriendas.',
        stock: 150,
        category: 'Frutas Frescas',
        imageUrl: '/assets/manzana.png',
        rating: 4.5,
        reviews: [
            { user: 'Ana Pérez', date: '2025-08-20', comment: '¡Deliciosas y muy frescas! Las mejores que he probado.' },
            { user: 'Carlos Soto', date: '2025-08-18', comment: 'Llegaron en perfecto estado. Muy recomendables.' }
        ]
    },
    {
        id: 'FR002',
        name: 'Naranjas Valencia',
        price: 1000,
        description: 'Jugosas y ricas en vitamina C, ideales para zumos frescos y refrescantes.',
        stock: 200,
        category: 'Frutas Frescas',
        imageUrl: '/assets/naranja.png',
        rating: 4.8,
        reviews: [
            { user: 'Laura Mena', date: '2025-08-22', comment: 'Perfectas para hacer jugo, muy dulces.' }
        ]
    },
    {
        id: 'FR003',
        name: 'Plátanos Cavendish',
        price: 800,
        description: 'Plátanos maduros y dulces, perfectos para el desayuno o como snack energético.',
        stock: 250,
        category: 'Frutas Frescas',
        imageUrl: '/assets/platano.png',
        rating: 4.6,
        reviews: [
            { user: 'Jorge Torres', date: '2025-09-01', comment: 'Muy buen sabor y llegaron en el punto justo de madurez.'}
        ]
    },
    {
        id: 'VR001',
        name: 'Zanahorias Orgánicas',
        price: 900,
        description: 'Crujientes y cultivadas sin pesticidas en la Región de O\'Higgins.',
        stock: 100,
        category: 'Verduras Orgánicas',
        imageUrl: '/assets/zanahoria.png',
        rating: 4.2,
        reviews: []
    },
    {
        id: 'VR002',
        name: 'Espinacas Frescas',
        price: 700,
        description: 'Espinacas frescas y nutritivas, perfectas para ensaladas y batidos verdes.',
        stock: 80,
        category: 'Verduras Orgánicas',
        imageUrl: '/assets/espinacas.png',
        rating: 4.4,
        reviews: [
            { user: 'Mónica Salas', date: '2025-09-03', comment: 'Se nota la frescura, muy buena calidad.'}
        ]
    },
    {
        id: 'VR003',
        name: 'Pimientos Tricolores',
        price: 1500,
        description: 'Pimientos rojos, amarillos y verdes, ideales para salteados y platos coloridos.',
        stock: 120,
        category: 'Verduras Orgánicas',
        imageUrl: '/assets/pimenton.png',
        rating: 4.7,
        reviews: [
            { user: 'Andrés Vera', date: '2025-09-02', comment: 'Excelentes para cocinar, muy sabrosos y frescos.'}
        ]
    },
    {
        id: 'PO001',
        name: 'Miel Orgánica',
        price: 5000,
        description: 'Pura y orgánica, producida por apicultores locales. Rica en antioxidantes.',
        stock: 50,
        category: 'Productos Orgánicos',
        imageUrl: '/assets/miel.png',
        rating: 5.0,
        reviews: [
            { user: 'Roberto Díaz', date: '2025-08-25', comment: 'Calidad excepcional, se nota que es 100% natural.' }
        ]
    },
    {
        id: 'PO003',
        name: 'Quinua Orgánica',
        price: 3500,
        description: 'Grano andino nutritivo y versátil, perfecto para ensaladas y platos saludables.',
        stock: 60,
        category: 'Productos Orgánicos',
        imageUrl: '/assets/quinua.png',
        rating: 4.9,
        reviews: [
            { user: 'Valentina Rojas', date: '2025-08-30', comment: 'Excelente producto, muy limpio y de buena calidad.'}
        ]
    },
    {
        id: 'PL001',
        name: 'Leche Entera',
        price: 1100,
        description: 'Leche fresca y cremosa de granjas locales, ideal para un desayuno nutritivo.',
        stock: 75,
        category: 'Productos Lácteos',
        imageUrl: '/assets/leche.png',
        rating: 4.0,
        reviews: [
            { user: 'Marta González', date: '2025-09-01', comment: 'Buen sabor, pero la botella es algo pequeña.' }
        ]
    }
];

// Función para obtener todos los productos
export const getProducts = () => {
    return products;
}

// Función para obtener solo los productos destacados (los 3 primeros)
export const getFeaturedProducts = () => {
    return products.slice(0, 3);
}
