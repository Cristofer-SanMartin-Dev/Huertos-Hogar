// Ruta: src/components/PasswordInput.jsx
import React, { useState } from 'react';

const EyeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOffIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

/**
 * Campo de contraseña con botón para mostrar/ocultar el texto. El input
 * sigue siendo type="password" salvo que el usuario lo revele a propósito,
 * así que no cambia nada de seguridad, solo evita el típico "me equivoqué
 * de tecla y no lo veo" al escribir.
 */
const PasswordInput = ({ id, label, value, onChange, error, required, helpText, autoComplete }) => {
    const [visible, setVisible] = useState(false);

    return (
        <div className="form-group">
            {label && <label htmlFor={id}>{label}</label>}
            <div className="input-group">
                <input
                    type={visible ? 'text' : 'password'}
                    id={id}
                    className={`form-control ${error ? 'is-invalid' : ''}`}
                    value={value}
                    onChange={onChange}
                    required={required}
                    autoComplete={autoComplete}
                />
                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setVisible(v => !v)}
                    tabIndex={-1}
                    aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                    {visible ? <EyeOffIcon /> : <EyeIcon />}
                </button>
            </div>
            {helpText && <div className="form-text">{helpText}</div>}
            {error && <div className="invalid-feedback d-block">{error}</div>}
        </div>
    );
};

export default PasswordInput;
