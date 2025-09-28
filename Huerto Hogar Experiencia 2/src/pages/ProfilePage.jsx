import React from 'react';

const ProfilePage = () => {
  return (
    <div className="container py-4">
      {/* Header */}
      <header className="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom">
        <h1 className="my-0 mr-md-auto font-weight-normal">
          <a href="/" className="text-decoration-none text-dark">HuertoHogar</a>
        </h1>
        <nav className="my-2 my-md-0 mr-md-3">
          <a className="p-2 text-dark" href="/">Inicio</a>
          <a className="p-2 text-dark" href="/productos">Productos</a>
          <a className="p-2 text-dark" href="/carrito">Carrito</a>
          <a className="p-2 text-dark" href="/login">Iniciar Sesión</a>
          <a className="p-2 text-dark" href="/perfil">Mi Perfil</a>
        </nav>
      </header>

      {/* Perfil de Usuario */}
      <main>
        <h2>Mi Perfil</h2>
        <div className="card p-4 mb-4">
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <p className="mb-0"><strong>Nombre:</strong> Juan Pérez (simulado)</p>
            <button className="btn btn-outline-secondary btn-sm" title="Editar Nombre">✏️</button>
          </div>
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <p className="mb-0"><strong>Email:</strong> juan.perez@example.com</p>
            <button className="btn btn-outline-secondary btn-sm" title="Editar Email">✏️</button>
          </div>
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <p className="mb-0"><strong>Dirección:</strong> Av. Siempre Viva 123, Santiago</p>
            <button className="btn btn-outline-secondary btn-sm" title="Editar Dirección">✏️</button>
          </div>
        </div>

        <h3>Historial de Compras</h3>
        <div className="order-history mb-4">
          <div className="card mb-2 p-3">
            <p className="mb-0"><strong>Pedido #12345</strong> - 25/08/2025 - <strong>Estado:</strong> Entregado</p>
          </div>
          <div className="card mb-2 p-3">
            <p className="mb-0"><strong>Pedido #12348</strong> - 01/09/2025 - <strong>Estado:</strong> En preparación</p>
            <p className="mb-0">Puedes rastrear tu pedido <a href="#">aquí</a>.</p>
          </div>
        </div>
        <button className="btn btn-danger w-100" id="logout-btn">Cerrar Sesión</button>
      </main>

      {/* Footer */}
      <footer className="footer mt-auto py-3 bg-dark text-white">
        <div className="container text-center">
          <p>&copy; 2025 HuertoHogar. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default ProfilePage;
