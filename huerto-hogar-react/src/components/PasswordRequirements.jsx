// Ruta: src/components/PasswordRequirements.jsx
import React from 'react';

// Mismas condiciones que valida el backend (AuthService.PASSWORD_PATTERN).
const REQUISITOS = [
    { label: 'Al menos 8 caracteres', test: (p) => p.length >= 8 },
    { label: 'Una letra mayúscula', test: (p) => /[A-Z]/.test(p) },
    { label: 'Una letra minúscula', test: (p) => /[a-z]/.test(p) },
    { label: 'Un número', test: (p) => /\d/.test(p) },
    { label: 'Un símbolo (ej: !@#$%)', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

/** Lista de requisitos de la contraseña que pasa de rojo a verde a medida que se cumplen. */
const PasswordRequirements = ({ password }) => (
    <ul className="password-requirements list-unstyled mb-2 small">
        {REQUISITOS.map(req => {
            const cumplido = req.test(password);
            return (
                <li key={req.label} className={cumplido ? 'text-success' : 'text-danger'}>
                    <span aria-hidden="true">{cumplido ? '✓' : '✗'}</span> {req.label}
                </li>
            );
        })}
    </ul>
);

export default PasswordRequirements;
