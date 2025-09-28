import React from 'react';

const LoginPage = () => {
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
          <a className="p-2 text-dark d-none" href="/perfil">Mi Perfil</a>
        </nav>
      </header>

      {/* Login Form */}
      <main>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <form className="card p-4 shadow-sm">
              <h2 className="mb-4">Acceso de Clientes</h2>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Correo Electrónico:</label>
                <input type="email" className="form-control" id="email" required />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Contraseña:</label>
                <input type="password" className="form-control" id="password" required />
              </div>
              <div className="text-danger mb-3" id="login-error"></div>
              <button type="submit" className="btn btn-success w-100 mb-2" id="login-btn">Ingresar</button>
              <p className="text-center">¿No tienes cuenta? <a href="/register">Regístrate aquí</a></p>
            </form>
          </div>
        </div>
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

export default LoginPage;
