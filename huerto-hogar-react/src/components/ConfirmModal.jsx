// Ruta: src/components/ConfirmModal.jsx
import React from 'react';

/**
 * Modal de confirmación genérico con los colores de la marca, para
 * reemplazar window.confirm() (que no se puede estilizar) en cualquier
 * acción que necesite doble confirmación — no es específico de productos.
 */
const ConfirmModal = ({
  show,
  title = 'Confirmar acción',
  message,
  confirmLabel = 'Aceptar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  onConfirm,
  onCancel,
}) => {
  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" style={{ fontFamily: 'var(--font-header)', color: 'var(--accent-brown)' }}>
              {title}
            </h5>
            <button type="button" className="btn-close" onClick={onCancel} aria-label="Cerrar"></button>
          </div>
          <div className="modal-body">
            <p className="mb-0">{message}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
              {cancelLabel}
            </button>
            <button type="button" className={`btn btn-${variant}`} onClick={onConfirm}>
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
