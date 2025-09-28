import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

// Productos destacados (puedes usar los primeros del array de productos)
const featuredProducts = [
  {
    id: 'FR001',
    name: 'Manzanas Fuji',
    price: 1200,
    description: 'Crujientes y dulces, cultivadas en el Valle del Maule. Perfectas para meriendas.',
    stock: 150,
    imageUrl: require('../assets/manzana.png'),
  },
  {
    id: 'FR002',
    name: 'Naranjas Valencia',
    price: 1000,
    description: 'Jugosas y ricas en vitamina C, ideales para zumos frescos y refrescantes.',
    stock: 200,
    imageUrl: require('../assets/naranja.png'),
  },
  {
    id: 'VR001',
    name: 'Zanahorias Orgánicas',
    price: 900,
    description: 'Crujientes y cultivadas sin pesticidas en la Región de O\'Higgins.',
    stock: 100,
    imageUrl: require('../assets/zanahoria.png'),
  }
];

export const HomePage = () => {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="container py-4">
      {/* Header */}
      <header className="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom">
        <h1 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/" className="text-decoration-none text-dark">HuertoHogar</Link>
        </h1>
        <nav className="my-2 my-md-0 mr-md-3">
          <Link className="p-2 text-dark" to="/">Inicio</Link>
          <Link className="p-2 text-dark" to="/products">Productos</Link>
          <Link className="p-2 text-dark" to="/cart">Carrito</Link>
          <Link className="p-2 text-dark" to="/login">Iniciar Sesión</Link>
          <Link className="p-2 text-dark d-none" to="/profile">Mi Perfil</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-light p-5 rounded mb-4">
        <h2>Frescura del Campo a tu Hogar</h2>
        <p>Descubre la calidad de los productos de HuertoHogar. ¡Directo de la tierra a tu mesa!</p>
        <Link to="/products" className="btn btn-success">Ver Productos</Link>
      </section>

      {/* Productos Destacados */}
      <section className="mb-5">
        <h3>Productos Destacados</h3>
        <div className="row" id="featured-products-grid">
          {featuredProducts.map(product => (
            <div key={product.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <img src={product.imageUrl} alt={product.name} className="card-img-top" style={{ height: 180, objectFit: 'cover' }} />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text"><strong>${product.price.toLocaleString('es-CL')}</strong></p>
                  <button
                    className="btn btn-success w-100"
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Us */}
      <section className="mb-5">
        <h3>¿Quiénes Somos?</h3>
        <p><strong>HuertoHogar</strong> es una tienda online dedicada a llevar la frescura y calidad de los productos del campo directamente a la puerta de nuestros clientes en Chile. Con más de 6 años de experiencia, operamos en más de 9 puntos a lo largo del país, incluyendo ciudades clave como Santiago, Puerto Montt, Villarica, Nacimiento, Viña del Mar, Valparaíso, y Concepción. Nuestra misión es conectar a las familias chilenas con el campo, promoviendo un estilo de vida saludable y sostenible.</p>
        <div className="row">
          <div className="col-md-6 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <h4 className="card-title">Nuestra Misión</h4>
                <p className="card-text">Proporcionar productos frescos y de calidad directamente desde el campo hasta la puerta de nuestros clientes, garantizando la frescura y el sabor en cada entrega. Nos comprometemos a fomentar una conexión más cercana entre los consumidores y los agricultores locales, apoyando prácticas agrícolas sostenibles y promoviendo una alimentación saludable en todos los hogares chilenos.</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <h4 className="card-title">Nuestra Visión</h4>
                <p className="card-text">Ser la tienda online líder en la distribución de productos frescos y naturales en Chile, reconocida por nuestra calidad excepcional, servicio al cliente y compromiso con la sostenibilidad. Aspiramos a expandir nuestra presencia a nivel nacional e internacional, estableciendo un nuevo estándar en la distribución de productos agrícolas directos del productor al consumidor.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de Reseñas (puede implementarse con Bootstrap Modal en el futuro) */}
      {/* ... */}

      {/* Footer */}
      <footer className="footer mt-auto py-3 bg-dark text-white">
        <div className="container text-center">
          <p>&copy; 2025 HuertoHogar. Todos los derechos reservados.</p>
          <div>
            <a href="#" className="text-white mx-2">Facebook</a>|
            <a href="#" className="text-white mx-2">Instagram</a>|
            <a href="#" className="text-white mx-2">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
};