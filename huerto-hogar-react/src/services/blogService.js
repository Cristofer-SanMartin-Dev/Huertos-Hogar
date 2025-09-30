// src/services/blogService.js

// TUTOR: Hemos añadido la propiedad `imageUrl` a cada objeto de post.
// La ruta apunta a la carpeta `public/assets/`, que es la forma correcta
// de manejar archivos estáticos en Vite.

const posts = [
  {
    id: 1,
    title: '5 Beneficios de Comer Productos Orgánicos',
    author: 'Ana Verde',
    date: '2025-09-15',
    imageUrl: '/assets/blog_organico.png', // <-- IMAGEN AÑADIDA
    summary: 'Descubre por qué elegir alimentos orgánicos puede transformar tu salud y el medio ambiente. Desde un mayor valor nutricional hasta un menor impacto ecológico, te contamos todo lo que necesitas saber.',
    content: `
      <p>Adoptar una dieta basada en productos orgánicos es una de las mejores decisiones que puedes tomar por tu salud y la del planeta. A diferencia de la agricultura convencional, la producción orgánica evita el uso de pesticidas y fertilizantes sintéticos, lo que se traduce en alimentos más puros y nutritivos.</p>
      <p><strong>1. Mayor Valor Nutricional:</strong> Estudios sugieren que los alimentos orgánicos pueden tener niveles más altos de ciertos nutrientes, como antioxidantes.</p>
      <p><strong>2. Sin Pesticidas Nocivos:</strong> Al evitar los químicos sintéticos, reduces la exposición de tu cuerpo a sustancias que pueden ser perjudiciales a largo plazo.</p>
      <p><strong>3. Mejor Sabor:</strong> Muchos consumidores afirman que los productos orgánicos, al crecer en suelos más equilibrados y sanos, simplemente saben mejor.</p>
      <p><strong>4. Apoyo a la Biodiversidad:</strong> La agricultura orgánica promueve ecosistemas saludables, ayudando a preservar la vida silvestre y la diversidad de especies.</p>
      <p><strong>5. Cuidado del Agua y del Suelo:</strong> Al no utilizar fertilizantes sintéticos, se evita la contaminación de las fuentes de agua y se mantiene la fertilidad del suelo para futuras generaciones.</p>
    `
  },
  {
    id: 2,
    title: 'Guía para un Huerto Sostenible en Casa',
    author: 'Carlos Huertas',
    date: '2025-09-22',
    imageUrl: '/assets/blog-huerto.png', // <-- IMAGEN AÑADIDA
    summary: '¿Siempre has querido tener tu propio huerto? Te guiamos paso a paso para crear un pequeño oasis de sostenibilidad en tu hogar, sin importar el espacio que tengas disponible.',
    content: `
      <p>Crear un huerto en casa es una experiencia gratificante que te conecta con la naturaleza y te proporciona alimentos frescos. Aquí tienes una guía básica para empezar:</p>
      <p><strong>1. Elige el Lugar Adecuado:</strong> Busca un lugar que reciba al menos 6 horas de luz solar directa al día. Puede ser un balcón, una terraza o un pequeño jardín.</p>
      <p><strong>2. Prepara los Contenedores y el Suelo:</strong> No necesitas un gran terreno. Macetas, jardineras o incluso botellas recicladas pueden servir. Usa una mezcla de tierra de hojas, compost y perlita para asegurar un buen drenaje y nutrición.</p>
      <p><strong>3. Selecciona tus Cultivos:</strong> Para empezar, elige plantas fáciles de cuidar como lechugas, tomates cherry, hierbas aromáticas (albahaca, menta) o rábanos.</p>
      <p><strong>4. Riego Consciente:</strong> Riega temprano en la mañana o al atardecer para evitar la evaporación. Toca la tierra para sentir si está seca antes de volver a regar.</p>
      <p><strong>5. Compostaje Casero:</strong> Aprovecha los restos de cocina (cáscaras de fruta, posos de café) para crear tu propio compost. Es el mejor fertilizante natural para tu huerto.</p>
    `
  }
];

export const getPosts = () => {
  return posts;
};

export const getPostById = (id) => {
  return posts.find(post => post.id === parseInt(id));
};