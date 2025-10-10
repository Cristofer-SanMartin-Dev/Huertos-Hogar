// Ruta: src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; 

const RegisterPage = () => {
  // --- ESTADOS MODIFICADOS ---
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [calle, setCalle] = useState('');
  const [region, setRegion] = useState('');
  const [comuna, setComuna] = useState('');
  // --- FIN ESTADOS MODIFICADOS ---

  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // --- VALIDACIÓN ACTUALIZADA ---
    if (!nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
    if (!apellidos.trim()) newErrors.apellidos = 'El apellido es obligatorio.';
    if (!calle.trim()) newErrors.calle = 'La calle es obligatoria.';
    if (!region.trim()) newErrors.region = 'La región es obligatoria.';
    if (!comuna.trim()) newErrors.comuna = 'La comuna es obligatoria.';

    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'El formato del correo no es válido.';
    }
    if (!password) {
      newErrors.password = 'La contraseña es obligatoria.';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }
    // --- FIN VALIDACIÓN ---

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // --- OBJETO USER MODIFICADO ---
      const user = { nombre, apellidos, email, password, calle, region, comuna };
      
      console.log("Validación exitosa. Enviando a la API:", user);

      register(user)
        .then(response => {
          alert('¡Registro exitoso! Serás redirigido para iniciar sesión.');
          navigate('/login');
        })
        .catch(error => {
          console.error("Error en el registro:", error); 
          if (error.response && error.response.data) {
            setErrors({ api: error.response.data || 'Error en el registro.' });
          } else if (error.request) {
            setErrors({ api: 'No se pudo conectar con el servidor.' });
          } else {
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
        <form onSubmit={handleSubmit} noValidate>
          
          {/* --- FORMULARIO MODIFICADO --- */}
          <div className="row g-3">
            <div className="col-sm-6 form-group">
              <label htmlFor="nombre">Nombre:</label>
              <input type="text" id="nombre" className={`form-control ${errors.nombre ? 'is-invalid' : ''}`} value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
            </div>

            <div className="col-sm-6 form-group">
              <label htmlFor="apellidos">Apellidos:</label>
              <input type="text" id="apellidos" className={`form-control ${errors.apellidos ? 'is-invalid' : ''}`} value={apellidos} onChange={(e) => setApellidos(e.target.value)} required />
              {errors.apellidos && <div className="invalid-feedback">{errors.apellidos}</div>}
            </div>

            <div className="col-12 form-group">
              <label htmlFor="email">Correo Electrónico:</label>
              <input type="email" id="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} value={email} onChange={(e) => setEmail(e.target.value)} required />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="col-12 form-group">
              <label htmlFor="calle">Calle y Número:</label>
              <input type="text" id="calle" className={`form-control ${errors.calle ? 'is-invalid' : ''}`} value={calle} onChange={(e) => setCalle(e.target.value)} required />
              {errors.calle && <div className="invalid-feedback">{errors.calle}</div>}
            </div>

            <div className="col-md-6 form-group">
              <label htmlFor="region">Región:</label>
              <input type="text" id="region" className={`form-control ${errors.region ? 'is-invalid' : ''}`} value={region} onChange={(e) => setRegion(e.target.value)} required />
              {errors.region && <div className="invalid-feedback">{errors.region}</div>}
            </div>

            <div className="col-md-6 form-group">
              <label htmlFor="comuna">Comuna:</label>
              <input type="text" id="comuna" className={`form-control ${errors.comuna ? 'is-invalid' : ''}`} value={comuna} onChange={(e) => setComuna(e.target.value)} required />
              {errors.comuna && <div className="invalid-feedback">{errors.comuna}</div>}
            </div>

            <div className="col-12 form-group">
              <label htmlFor="password">Contraseña:</label>
              <input type="password" id="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} value={password} onChange={(e) => setPassword(e.target.value)} required />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
          </div>
          {/* --- FIN FORMULARIO MODIFICADO --- */}
          
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