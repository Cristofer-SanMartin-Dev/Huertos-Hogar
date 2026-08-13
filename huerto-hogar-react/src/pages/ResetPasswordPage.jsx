// Ruta: src/pages/ResetPasswordPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../services/authService.js';
import PasswordInput from '../components/PasswordInput.jsx';
import PasswordRequirements from '../components/PasswordRequirements.jsx';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_REGEX = /^\d{6}$/;

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // El email viaja desde ForgotPasswordPage (navigate con state). Si no está
  // — ej. se recargó la página o se llegó directo a esta URL — se pide de
  // nuevo: el código por sí solo no alcanza para identificar el pedido.
  const emailDesdeState = location.state?.email || '';

  const [email, setEmail] = useState(emailDesdeState);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim() || !EMAIL_REGEX.test(email.trim())) {
      newErrors.email = 'Ingresa un correo electrónico válido.';
    }

    if (!code.trim()) {
      newErrors.code = 'El código es obligatorio.';
    } else if (!CODE_REGEX.test(code.trim())) {
      newErrors.code = 'El código tiene 6 dígitos.';
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors((prev) => ({ ...prev, api: undefined }));

    if (!validateForm()) return;

    setIsLoading(true);
    authService.resetPassword(email.trim(), code.trim(), password)
      .then(() => {
        setIsLoading(false);
        toast.success('¡Contraseña actualizada! Ya puedes iniciar sesión.');
        navigate('/login');
      })
      .catch((error) => {
        setIsLoading(false);
        setErrors({ api: error.response?.data || 'No se pudo restablecer la contraseña. Inténtalo de nuevo.' });
      });
  };

  return (
    <div className="container py-5">
      <div className="login-container">
        <h2 className="text-center section-title">Nueva Contraseña</h2>
        <p className="text-muted">
          {emailDesdeState ? (
            <>Ingresá el código de 6 dígitos que enviamos a <strong>{emailDesdeState}</strong> y tu contraseña nueva.</>
          ) : (
            'Ingresá tu correo, el código de 6 dígitos que te enviamos y tu contraseña nueva.'
          )}
        </p>
        <form onSubmit={handleSubmit} noValidate>
          {!emailDesdeState && (
            <div className="form-group mb-3">
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
          )}

          <div className="form-group mb-3">
            <label htmlFor="code">Código de verificación:</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              id="code"
              className={`form-control ${errors.code ? 'is-invalid' : ''}`}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              required
            />
            {errors.code && <div className="invalid-feedback">{errors.code}</div>}
          </div>

          <PasswordInput
            id="password"
            label="Contraseña nueva:"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            required
            autoComplete="new-password"
            helpText="Mínimo 8 caracteres, con mayúscula, minúscula, número y símbolo (ej: !@#$%)."
          />
          <PasswordRequirements password={password} />

          <div className="mt-3">
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

          {errors.api && <div className="alert alert-danger mt-3">{errors.api}</div>}

          <div className="d-grid mt-4">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Restablecer contraseña'}
            </button>
          </div>
        </form>
        <p className="text-center mt-3">
          <Link to="/olvide-password">¿No recibiste el código? Solicitar uno nuevo</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
