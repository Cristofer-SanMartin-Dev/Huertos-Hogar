// Ruta: src/pages/ResetPasswordPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../services/authService.js';
import PasswordInput from '../components/PasswordInput.jsx';

// Misma regla que valida el backend (AuthService.PASSWORD_PATTERN).
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
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
    authService.resetPassword(token, password)
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

  if (!token) {
    return (
      <div className="container py-5">
        <div className="login-container">
          <h2 className="text-center section-title">Enlace inválido</h2>
          <div className="alert alert-danger mt-3">
            Este enlace de recuperación no es válido. Solicita uno nuevo.
          </div>
          <p className="text-center mt-3">
            <Link to="/olvide-password">Solicitar un nuevo enlace</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="login-container">
        <h2 className="text-center section-title">Nueva Contraseña</h2>
        <form onSubmit={handleSubmit} noValidate>
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
      </div>
    </div>
  );
};

export default ResetPasswordPage;
