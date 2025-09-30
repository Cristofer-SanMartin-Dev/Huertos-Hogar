// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  // TUTOR: Usamos un estado para cada campo del formulario.
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // TUTOR: Este es el cambio clave. Usamos un único objeto de estado
  // para almacenar TODOS los mensajes de error. Es más limpio y fácil de manejar.
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();

  // TUTOR: Creamos una función de validación reutilizable.
  // Recorre todas las reglas de negocio y devuelve un objeto con los errores encontrados.
  const validateForm = () => {
    const newErrors = {};

    // 1. Validación del Nombre
    if (name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres.';
    }

    // 2. Validación del Email (usando una expresión regular)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = 'Por favor, ingresa un correo electrónico válido.';
    }

    // 3. Validación de la Contraseña (complejidad)
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
    
    // Devuelve `true` si no hay errores, `false` si hay al menos uno.
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Ejecutamos la validación. Si es exitosa, procedemos.
    if (validateForm()) {
      alert('¡Registro exitoso! Serás redirigido para iniciar sesión.');
      navigate('/login');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-4 p-md-5">
              <h2 className="card-title text-center mb-4" style={{ fontFamily: 'var(--font-header)' }}>Crea tu Cuenta</h2>
              <form onSubmit={handleSubmit} noValidate>
                
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Nombre Completo</label>
                  <input
                    type="text"
                    // TUTOR: Usamos clases condicionales de Bootstrap. Si hay un error
                    // para 'name' en el estado, se añade la clase 'is-invalid'.
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    // TUTOR: `onBlur` se dispara cuando el usuario quita el foco del input.
                    // Usamos esto para una validación en tiempo real.
                    onBlur={validateForm}
                    required
                  />
                  {/* TUTOR: Este div solo se renderiza si existe un mensaje de error para 'name' */}
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Correo Electrónico</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={validateForm}
                    required
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
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
              <p className="mt-3 text-center">
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;