// src/services/productService.js

// TUTOR: He actualizado la lista de productos para asegurarme de que todos
// tengan reseñas, como solicitaste. Los comentarios son variados para
// que la sección de reseñas se vea más realista.

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
            { user: 'Laura Mena', date: '2025-08-22', comment: 'Perfectas para hacer jugo, muy dulces y jugosas.' },
            { user: 'Javier Diaz', date: '2025-08-21', comment: 'Calidad insuperable. Se nota que son frescas.' }
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
        reviews: [
            { user: 'Elena M.', date: '2025-09-02', comment: 'Muy frescas y crujientes, excelente calidad.' },
            { user: 'Pedro G.', date: '2025-09-01', comment: 'Las mejores zanahorias que he comprado online.' }
        ]
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
            { user: 'Mónica Salas', date: '2025-09-03', comment: 'Se nota la frescura, muy buena calidad para mis batidos.'}
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
            { user: 'Andrés Vera', date: '2025-09-02', comment: 'Excelentes para cocinar, muy sabrosos y frescos.'},
            { user: 'Carla Nuñez', date: '2025-09-01', comment: 'Colores muy vivos y un sabor espectacular.' }
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
            { user: 'Roberto Díaz', date: '2025-08-25', comment: 'Calidad excepcional, se nota que es 100% natural. La mejor miel.' }
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
            { user: 'Marta González', date: '2025-09-01', comment: 'Buen sabor, pero la botella es algo pequeña.' },
            { user: 'Luis Campos', date: '2025-08-29', comment: 'Muy fresca, se nota la diferencia con la del supermercado.' }
        ]
    }
];

export const getProducts = () => products;
export const getFeaturedProducts = () => products.slice(0, 3);
