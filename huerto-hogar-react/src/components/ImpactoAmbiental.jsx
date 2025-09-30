// src/components/ImpactoAmbiental.jsx
import React from 'react';

/**
 * TUTOR: Este componente es puramente informativo.
 * - Recibe el `cart` como prop para poder mostrar datos dinámicos (aunque aquí
 * usaremos mensajes generales, se podría hacer más complejo).
 * - Está dividido en las dos secciones que pide el caso: Huella de Carbono y
 * Contribuciones a la Comunidad.
 * - Usamos íconos (emojis) y clases de Bootstrap para que se vea atractivo
 * visualmente y se integre bien con el resumen del pedido.
 */
const ImpactoAmbiental = ({ cart }) => {
  // Si el carrito está vacío, no mostramos nada.
  if (!cart || cart.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 p-3 border rounded bg-light">
      <h6 className="mb-3" style={{ fontFamily: 'var(--font-header)' }}>Tu Impacto Positivo</h6>
      
      {/* Sección Huella de Carbono */}
      <div className="d-flex align-items-start mb-2">
        <span className="fs-5 me-2">🌍</span>
        <div>
          <strong className="d-block">Reducción de Huella de Carbono</strong>
          <small className="text-muted">Al comprar productos locales, reduces la distancia de transporte y apoyas un planeta más sano.</small>
        </div>
      </div>

      {/* Sección Contribuciones a la Comunidad */}
      <div className="d-flex align-items-start">
        <span className="fs-5 me-2">🌱</span>
        <div>
          <strong className="d-block">Apoyo a Agricultores Locales</strong>
          <small className="text-muted">Tu compra contribuye directamente al sustento de familias agricultoras en nuestras comunidades.</small>
        </div>
      </div>
    </div>
  );
};

export default ImpactoAmbiental;