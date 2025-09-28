import React, { useState } from 'react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'El nombre es obligatorio.';
    if (!email.trim()) {
      newErrors.email = 'El correo es obligatorio.';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      newErrors.email = 'El correo no es válido.';
    }
    if (!password) {
      newErrors.password = 'La contraseña es obligatoria.';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setSuccess(true);
      // Aquí podrías agregar la lógica para guardar el usuario
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
        </nav>
      </header>

      {/* Register Form */}
      <main>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <form className="card p-4 shadow-sm" onSubmit={handleSubmit} noValidate>
              <h2 className="mb-4">Crea tu Cuenta</h2>
              <div className="mb-3">
                <label htmlFor="register-name" className="form-label">Nombre Completo:</label>
                <input
                  type="text"
                  className="form-control"
                  id="register-name"
                  placeholder="Juan Lopez"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
                {errors.name && <div className="text-danger mb-2">{errors.name}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="register-email" className="form-label">Correo Electrónico:</label>
                <input
                  type="email"
                  className="form-control"
                  id="register-email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                {errors.email && <div className="text-danger mb-2">{errors.email}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="register-password" className="form-label">Contraseña:</label>
                <input
                  type="password"
                  className="form-control"
                  id="register-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                {errors.password && <div className="text-danger mb-2">{errors.password}</div>}
              </div>
              <button type="submit" className="btn btn-success w-100 mb-2" id="register-btn">Registrarme</button>
              <p className="text-center">¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a></p>
              {success && <div className="alert alert-success mt-3">¡Registro exitoso!</div>}
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

export default RegisterPage;
