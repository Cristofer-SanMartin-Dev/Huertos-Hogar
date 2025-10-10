// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const success = login(email, password);

    if (success) {
      navigate('/perfil');
    } else {
      setError('Correo o contraseña incorrectos.');
    }
  };

  return (
    <div className="container py-5">
      {/*
       * TUTOR: Hemos reemplazado la estructura de 'card' por un 'div' con una clase personalizada.
       * Esto nos da más control sobre el diseño desde nuestro archivo CSS.
      */}
      <div className="login-container">
        {/*
         * TUTOR: Le quitamos la clase 'title-green' para que vuelva a tomar
         * el color marrón por defecto para los títulos h2.
        */}
        <h2 className="text-center" style={{ fontFamily: 'var(--font-header)' }}>
          Acceso de Clientes
        </h2>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              className={`form-control ${error && 'is-invalid'}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              className={`form-control ${error && 'is-invalid'}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <div className="invalid-feedback d-block mt-1">{error}</div>}
          </div>
          
          <div className="d-grid">
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