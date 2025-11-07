// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = 'Por favor, ingresa un correo electrónico válido.';
    }
    if (password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'La contraseña debe contener al menos una mayúscula.';
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = 'La contraseña debe contener al menos una minúscula.';
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = 'La contraseña debe contener al menos un número.';
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) {
      newErrors.password = 'La contraseña debe contener al menos un caracter especial.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert('¡Registro exitoso! Serás redirigido para iniciar sesión.');
      navigate('/login');
    }
  };

  return (
    <div className="container py-5">
      {/*
       * TUTOR: Usamos la misma clase 'login-container' que en el login
       * para que ambos formularios compartan el mismo estilo base (fondo, sombra, etc.).
      */}
      <div className="login-container">
        <h2 className="text-center" style={{ fontFamily: 'var(--font-header)' }}>
          Crea tu Cuenta
        </h2>
        
        <form onSubmit={handleSubmit} noValidate>
          {/*
           * TUTOR: Envolvemos cada campo en un 'form-group' para aplicar el espaciado
           * y la alineación que definimos en `index.css`.
          */}
          <div className="form-group">
            <label htmlFor="name">Nombre Completo:</label>
            <input
              type="text"
              id="name"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={validateForm}
              required
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validateForm}
              required
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={validateForm}
              required
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>
          
          <div className="d-grid mt-4">
            <button type="submit" className="btn btn-primary">Registrarme</button>
          </div>
        </form>

        <p className="text-center mt-3">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;