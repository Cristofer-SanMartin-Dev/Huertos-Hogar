import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; 

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState(''); 
  const [errors, setErrors] = useState({});
  
  const { register } = useAuth();
  const navigate = useNavigate();

  // Función para validar los campos del formulario
  const validateForm = () => {
    const newErrors = {};

    // Validar Nombre
    if (!name.trim()) {
      newErrors.name = 'El nombre completo es obligatorio.';
    }

    // Validar Email
    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'El formato del correo no es válido.';
    }

    // Validar Contraseña
    if (!password) {
      newErrors.password = 'La contraseña es obligatoria.';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }
    
    // Validar Dirección (puedes descomentar esto si la dirección es obligatoria)
    // if (!address.trim()) {
    //   newErrors.address = 'La dirección es obligatoria.';
    // }

    setErrors(newErrors);
    
    // Devuelve 'true' solo si no hay errores
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Valida el formulario
    if (validateForm()) {
      const user = { name, email, password, address };

      console.log("Validación exitosa. Enviando a la API:", user);

      // 2. Llama a la API de registro
      register(user)
        .then(response => {
          alert('¡Registro exitoso! Serás redirigido para iniciar sesión.');
          navigate('/login');
        })
        .catch(error => {
          console.error("Error en el registro:", error); 
          
          if (error.response && error.response.data) {
            
            // --- ¡ESTA ES LA MEJORA! ---
            // Lee el mensaje de error directamente (ej. "Error: El email ya está en uso.")
            // y lo pone en el estado 'api' para mostrarlo en el alert.
            setErrors({ api: error.response.data || 'Error en el registro.' });

          } else if (error.request) {
            // Error de red (backend caído o CORS)
            setErrors({ api: 'No se pudo conectar con el servidor. Revisa tu conexión.' });
          } else {
            // Otro tipo de error
            setErrors({ api: 'Error inesperado. Inténtalo de nuevo.' });
          }
        });
    } else {
      console.log("Validación fallida. No se envía el formulario.");
    }
  };

  return (
    <div className="container py-5">
      <div className="login-container">
        <h2 className="text-center section-title">Crea tu Cuenta</h2>
        {/* 'noValidate' deshabilita la validación HTML para usar la nuestra */}
        <form onSubmit={handleSubmit} noValidate>
          
          <div className="form-group">
            <label htmlFor="name">Nombre Completo:</label>
            <input 
              type="text" 
              id="name" 
              className={`form-control ${errors.name ? 'is-invalid' : ''}`} 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
            {/* Muestra el error de validación para este campo */}
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
              required 
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Dirección:</label>
            <input 
              type="text" 
              id="address" 
              className={`form-control ${errors.address ? 'is-invalid' : ''}`}
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
            />
             {errors.address && <div className="invalid-feedback">{errors.address}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input 
              type="password" 
              id="password" 
              className={`form-control ${errors.password ? 'is-invalid' : ''}`} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>
          
          {/* Aquí se mostrará el error "El email ya está en uso." */}
          {errors.api && <div className="alert alert-danger mt-3">{errors.api}</div>}
          
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