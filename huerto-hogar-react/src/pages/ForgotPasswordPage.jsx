// Ruta: src/pages/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // El backend siempre responde 200 (exista o no el email), así que una vez
  // enviado no tiene sentido dejar reintentar: solo confundiría al usuario.
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!EMAIL_REGEX.test(email.trim())) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }

    setIsLoading(true);
    authService.forgotPassword(email.trim())
      .then(() => {
        setIsLoading(false);
        setEnviado(true);
      })
      .catch(() => {
        setIsLoading(false);
        setError('No se pudo conectar con el servidor. Inténtalo de nuevo.');
      });
  };

  return (
    <div className="container py-5">
      <div className="login-container">
        <h2 className="text-center section-title">Recuperar Contraseña</h2>

        {enviado ? (
          <div className="alert alert-success mt-3" role="alert">
            Si ese correo está registrado, te enviamos un enlace para restablecer tu contraseña.
            Revisa tu bandeja de entrada (y la carpeta de spam).
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <p className="text-muted">
              Ingresa el correo con el que te registraste y te enviaremos un enlace para
              crear una contraseña nueva.
            </p>
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico:</label>
              <input
                type="email"
                id="email"
                className={`form-control ${error ? 'is-invalid' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {error && <div className="invalid-feedback">{error}</div>}
            </div>
            <div className="d-grid mt-4">
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
              </button>
            </div>
          </form>
        )}

        <p className="text-center mt-3">
          <Link to="/login">Volver a iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
