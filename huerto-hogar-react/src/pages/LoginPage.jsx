// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

/**
 * TUTOR: Esta es la página de inicio de sesión con un formulario controlado.
 * - `useState`: Mantenemos el estado para 'email', 'password' y 'error'.
 * - `useAuth`: Obtenemos la función `login` de nuestro contexto.
 * - `useNavigate`: Un hook de React Router que nos permite redirigir al usuario programáticamente.
 * - `handleSubmit`: Esta función se ejecuta al enviar el formulario. Llama a la función
 * `login` del contexto. Si tiene éxito, redirige al perfil; si no, muestra un error.
 */
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Limpiamos errores previos

    const success = login(email, password);

    if (success) {
      navigate('/perfil'); // Redirigir al perfil en caso de éxito
    } else {
      setError('Correo o contraseña incorrectos.');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4" style={{ fontFamily: 'var(--font-header)' }}>Acceso de Clientes</h2>
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Correo Electrónico</label>
                  <input
                    type="email"
                    className={`form-control ${error && 'is-invalid'}`}
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className={`form-control ${error && 'is-invalid'}`}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {error && <div className="invalid-feedback d-block">{error}</div>}
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">Ingresar</button>
                </div>
              </form>
              <p className="mt-3 text-center">
                ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;