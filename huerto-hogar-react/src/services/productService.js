// src/services/productService.js

/**
 * TUTOR: Esta es la versión final de tu base de datos simulada.
 * Todos los productos han sido enriquecidos con las propiedades:
 * - `priceUnit`: Especifica si el precio es por kilo, unidad, etc.
 * - `origin`: Indica el lugar de origen del producto.
 * - `sustainability`: Describe las prácticas sostenibles asociadas.
 * - `recipes`: Un array con ideas de recetas.
 */
export const products = [
    {
        id: 'FR001',
        name: 'Manzanas Fuji',
        price: 1200,
        priceUnit: 'por kilo',
        description: 'Crujientes y dulces, perfectas para meriendas saludables o como ingrediente en postres.',
        stock: 150,
        category: 'Frutas Frescas',
        imageUrl: '/assets/manzana.png',
        rating: 4.5,
        origin: 'Valle del Maule',
        sustainability: 'Cultivo con prácticas de agricultura integrada para reducir el impacto ambiental.',
        recipes: ['Tarta de Manzana', 'Ensalada Waldorf', 'Compota casera'],
        reviews: [
            { user: 'Ana Pérez', date: '2025-08-20', comment: '¡Deliciosas y muy frescas! Las mejores que he probado.' },
            { user: 'Carlos Soto', date: '2025-08-18', comment: 'Llegaron en perfecto estado. Muy recomendables.' }
        ]
    },
    {
        id: 'FR002',
        name: 'Naranjas Valencia',
        price: 1000,
        priceUnit: 'por kilo',
        description: 'Jugosas y ricas en vitamina C, estas naranjas son ideales para zumos frescos.',
        stock: 200,
        category: 'Frutas Frescas',
        imageUrl: '/assets/naranja.png',
        rating: 4.8,
        origin: 'Región de Valparaíso',
        sustainability: 'Riego por goteo para optimizar el uso del agua.',
        recipes: ['Jugo de Naranja natural', 'Queque de Naranja', 'Ensalada de verano'],
        reviews: [
            { user: 'Laura Mena', date: '2025-08-22', comment: 'Perfectas para hacer jugo, muy dulces y jugosas.' },
            { user: 'Javier Diaz', date: '2025-08-21', comment: 'Calidad insuperable. Se nota que son frescas.' }
        ]
    },
    {
        id: 'FR003',
        name: 'Plátanos Cavendish',
        price: 800,
        priceUnit: 'por kilo',
        description: 'Plátanos maduros y dulces, perfectos para el desayuno o como snack energético.',
        stock: 250,
        category: 'Frutas Frescas',
        imageUrl: '/assets/platano.png',
        rating: 4.6,
        origin: 'Importado de Ecuador',
        sustainability: 'Certificación de Comercio Justo para apoyar a los productores.',
        recipes: ['Batido de Plátano', 'Pan de Plátano', 'Tazón de Avena'],
        reviews: [
            { user: 'Jorge Torres', date: '2025-09-01', comment: 'Muy buen sabor y llegaron en el punto justo de madurez.'}
        ]
    },
    {
        id: 'VR001',
        name: 'Zanahorias Orgánicas',
        price: 900,
        priceUnit: 'por kilo',
        description: 'Zanahorias crujientes cultivadas sin pesticidas. Excelente fuente de vitamina A.',
        stock: 100,
        category: 'Verduras Orgánicas',
        imageUrl: '/assets/zanahoria.png',
        rating: 4.2,
        origin: 'Región de O\'Higgins',
        sustainability: 'Cultivo 100% orgánico certificado, sin uso de pesticidas.',
        recipes: ['Crema de Zanahoria', 'Jugo detox', 'Bastones de zanahoria con hummus'],
        reviews: [
            { user: 'Elena M.', date: '2025-09-02', comment: 'Muy frescas y crujientes, excelente calidad.' },
            { user: 'Pedro G.', date: '2025-09-01', comment: 'Las mejores zanahorias que he comprado online.' }
        ]
    },
     {
        id: 'VR002',
        name: 'Espinacas Frescas',
        price: 700,
        priceUnit: 'por bolsa de 500g',
        description: 'Espinacas frescas y nutritivas, perfectas para ensaladas y batidos verdes.',
        stock: 80,
        category: 'Verduras Orgánicas',
        imageUrl: '/assets/espinacas.png',
        rating: 4.4,
        origin: 'Valle de Aconcagua',
        sustainability: 'Cultivo hidropónico para un uso eficiente del agua y del espacio.',
        recipes: ['Batido Verde Energético', 'Ensalada de Espinacas y Fresas', 'Lasaña de Espinacas'],
        reviews: [
            { user: 'Mónica Salas', date: '2025-09-03', comment: 'Se nota la frescura, muy buena calidad para mis batidos.'}
        ]
    },
    {
        id: 'VR003',
        name: 'Pimientos Tricolores',
        price: 1500,
        priceUnit: 'por kilo',
        description: 'Pimientos rojos, amarillos y verdes, ideales para salteados y platos coloridos.',
        stock: 120,
        category: 'Verduras Orgánicas',
        imageUrl: '/assets/pimenton.png',
        rating: 4.7,
        origin: 'Región del Maule',
        sustainability: 'Invernaderos con control climático para reducir la necesidad de químicos.',
        recipes: ['Pimientos Rellenos', 'Fajitas de Verduras', 'Parrillada de Vegetales'],
        reviews: [
            { user: 'Andrés Vera', date: '2025-09-02', comment: 'Excelentes para cocinar, muy sabrosos y frescos.'},
            { user: 'Carla Nuñez', date: '2025-09-01', comment: 'Colores muy vivos y un sabor espectacular.' }
        ]
    },
    {
        id: 'PO001',
        name: 'Miel Orgánica',
        price: 5000,
        priceUnit: 'por frasco de 500g',
        description: 'Miel pura y orgánica producida por apicultores locales. Rica en antioxidantes.',
        stock: 50,
        category: 'Productos Orgánicos',
        imageUrl: '/assets/miel.png',
        rating: 5.0,
        origin: 'Región de la Araucanía',
        sustainability: 'Apicultura sostenible que protege a las abejas y la flora local.',
        recipes: ['Endulzante para té', 'Aderezo para ensaladas', 'Mascarilla facial natural'],
        reviews: [
            { user: 'Roberto Díaz', date: '2025-08-25', comment: 'Calidad excepcional, se nota que es 100% natural. La mejor miel.' }
        ]
    },
    {
        id: 'PO003',
        name: 'Quinua Orgánica',
        price: 3500,
        priceUnit: 'por bolsa de 500g',
        description: 'Grano andino nutritivo y versátil, perfecto para ensaladas y platos saludables.',
        stock: 60,
        category: 'Productos Orgánicos',
        imageUrl: '/assets/quinua.png',
        rating: 4.9,
        origin: 'Altiplano Chileno',
        sustainability: 'Cultivo ancestral que no requiere riego intensivo.',
        recipes: ['Ensalada de Quinua', 'Quinua con Verduras Salteadas', 'Hamburguesas de Quinua'],
        reviews: [
            { user: 'Valentina Rojas', date: '2025-08-30', comment: 'Excelente producto, muy limpio y de buena calidad.'}
        ]
    },
    {
        id: 'PL001',
        name: 'Leche Entera',
        price: 1100,
        priceUnit: 'por litro',
        description: 'Leche fresca y cremosa de granjas locales, ideal para un desayuno nutritivo.',
        stock: 75,
        category: 'Productos Lácteos',
        imageUrl: '/assets/leche.png',
        rating: 4.0,
        origin: 'Región de Los Lagos',
        sustainability: 'Ganadería de libre pastoreo que promueve el bienestar animal.',
        recipes: ['Café con Leche', 'Salsa Blanca Casera', 'Arroz con Leche'],
        reviews: [
            { user: 'Marta González', date: '2025-09-01', comment: 'Buen sabor, pero la botella es algo pequeña.' },
            { user: 'Luis Campos', date: '2025-08-29', comment: 'Muy fresca, se nota la diferencia con la del supermercado.' }
        ]
    }
];

export const getProducts = () => products;
export const getFeaturedProducts = () => products.slice(0, 3);