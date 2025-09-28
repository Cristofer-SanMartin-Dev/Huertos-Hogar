import React, { useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (!email.trim()) {
      return 'El correo es obligatorio.';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return 'El correo no es válido.';
    }
    if (!password) {
      return 'La contraseña es obligatoria.';
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validate();
    setError(validationError);
    if (!validationError) {
      setSuccess(true);
      // Aquí podrías agregar la lógica de autenticación
    } else {
      setSuccess(false);
    }
  };

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
            <form className="card p-4 shadow-sm" onSubmit={handleSubmit} noValidate>
              <h2 className="mb-4">Acceso de Clientes</h2>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Correo Electrónico:</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Contraseña:</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <div className="text-danger mb-3">{error}</div>}
              <button type="submit" className="btn btn-success w-100 mb-2" id="login-btn">Ingresar</button>
              <p className="text-center">¿No tienes cuenta? <a href="/register">Regístrate aquí</a></p>
              {success && <div className="alert alert-success mt-3">¡Inicio de sesión exitoso!</div>}
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
