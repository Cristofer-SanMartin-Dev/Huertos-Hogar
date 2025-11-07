// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth(); // Este 'login' ahora llama a la API
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Llama a la función login del contexto. Devuelve una Promesa.
    login(email, password)
      .then(loggedInUser => {
        // Si la promesa se resuelve (login exitoso), redirige según el ROL
        if (loggedInUser.role === 'ADMIN') {
            navigate('/admin');
        } else {
            navigate('/perfil');
        }
      })
      .catch(error => {
        // Si la promesa se rechaza (login fallido)
        if (error.response && error.response.data) {
          setError(error.response.data); // Muestra "Error: Email o contraseña incorrectos."
        } else {
          setError('Ocurrió un error al intentar iniciar sesión.');
        }
      });
  };

  return (
    <div className="container py-5">
      <div className="login-container">
        <h2 className="text-center section-title">Acceso de Clientes</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico:</label>
            <input type="email" id="email" className={`form-control ${error ? 'is-invalid' : ''}`} value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input type="password" id="password" className={`form-control ${error ? 'is-invalid' : ''}`} value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <div className="invalid-feedback d-block mt-1">{error}</div>}
          </div>
          <div className="d-grid mt-4">
            <button type="submit" className="btn btn-primary">Ingresar</button>
          </div>
        </form>
        <p className="text-center mt-3">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;