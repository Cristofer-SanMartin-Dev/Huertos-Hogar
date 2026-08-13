// Ruta: src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext.js';
import PasswordInput from '../components/PasswordInput.jsx';

const RegisterPage = () => {
  // --- ESTADOS MODIFICADOS ---
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [calle, setCalle] = useState('');
  const [region, setRegion] = useState('');
  const [comuna, setComuna] = useState('');
  const [telefono, setTelefono] = useState('');
  // --- FIN ESTADOS MODIFICADOS ---

  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  // Mismas reglas que valida el backend (AuthService.validarRegistro): la
  // validación real vive en el servidor, esta es solo para dar feedback
  // inmediato sin esperar el viaje de ida y vuelta a la API.
  const NOMBRE_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,}$/;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const TELEFONO_REGEX = /^\+?\d{8,15}$/;
  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  const validateForm = () => {
    const newErrors = {};

    // --- VALIDACIÓN ACTUALIZADA ---
    if (!nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio.';
    } else if (!NOMBRE_REGEX.test(nombre.trim())) {
      newErrors.nombre = 'El nombre debe tener solo letras y al menos 2 caracteres.';
    }

    if (!apellidos.trim()) {
      newErrors.apellidos = 'El apellido es obligatorio.';
    } else if (!NOMBRE_REGEX.test(apellidos.trim())) {
      newErrors.apellidos = 'Los apellidos deben tener solo letras y al menos 2 caracteres.';
    }

    if (!calle.trim()) {
      newErrors.calle = 'La calle es obligatoria.';
    } else if (calle.trim().length < 3) {
      newErrors.calle = 'La calle debe tener al menos 3 caracteres.';
    }

    if (!region.trim()) newErrors.region = 'La región es obligatoria.';
    if (!comuna.trim()) newErrors.comuna = 'La comuna es obligatoria.';

    if (!telefono.trim()) {
      newErrors.telefono = 'El número de contacto es obligatorio.';
    } else if (!TELEFONO_REGEX.test(telefono.trim())) {
      newErrors.telefono = 'El teléfono debe tener entre 8 y 15 dígitos (puede empezar con +).';
    }

    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      newErrors.email = 'El formato del correo no es válido.';
    }

    if (!password) {
      newErrors.password = 'La contraseña es obligatoria.';
    } else if (!PASSWORD_REGEX.test(password)) {
      newErrors.password = 'Debe tener 8+ caracteres, con mayúscula, minúscula, número y símbolo.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirma la contraseña.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }
    // --- FIN VALIDACIÓN ---

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // --- OBJETO USER MODIFICADO ---
      const user = { nombre, apellidos, email, password, calle, region, comuna, telefono };

      register(user)
        .then(() => {
          toast.success('¡Registro exitoso! Ya puedes iniciar sesión.');
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
              <label htmlFor="telefono">Número de Contacto:</label>
              <input type="tel" id="telefono" className={`form-control ${errors.telefono ? 'is-invalid' : ''}`} value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
              {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
            </div>

            <div className="col-sm-6">
              <PasswordInput
                id="password"
                label="Contraseña:"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                required
                autoComplete="new-password"
                helpText="Mínimo 8 caracteres, con mayúscula, minúscula, número y símbolo (ej: !@#$%)."
              />
            </div>

            <div className="col-sm-6">
              <PasswordInput
                id="confirmPassword"
                label="Confirmar contraseña:"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                required
                autoComplete="new-password"
              />
            </div>
          </div>
          {/* --- FIN FORMULARIO MODIFICADO --- */}
          
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