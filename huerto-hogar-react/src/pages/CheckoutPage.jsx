import React, { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';

// TUTOR: Este componente simula la página de checkout (Figura 6).
const CheckoutPage = () => {
    const { cart, clearCart } = useCart();
    const navigate = useNavigate();

    // Calcula el total
    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    // Estados para el formulario (simulado)
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [correo, setCorreo] = useState('');

    // Función para simular el pago
    const handlePagar = (e) => {
        e.preventDefault();
        // Lógica de pago simulada:
        // Si el nombre es "error", simulamos un pago fallido.
        if (nombre.toLowerCase() === 'error') {
            navigate('/pago-error');
        } else {
            // Si todo está bien, limpiamos el carrito y vamos a la pág de éxito.
            clearCart();
            navigate('/pago-exitoso');
        }
    };

    return (
        <div className="container py-5">
            <h2 className="mb-4 section-title">Completa tu Compra</h2>
            <div className="row g-5">
                {/* Columna del Resumen del Carrito */}
                <div className="col-md-5 col-lg-4 order-md-last">
                    <h4 className="d-flex justify-content-between align-items-center mb-3">
                        <span className="product-title">Tu Carrito</span>
                        <span className="badge bg-primary rounded-pill">{cart.length}</span>
                    </h4>
                    <ul className="list-group mb-3">
                        {cart.map(item => (
                            <li key={item.id} className="list-group-item d-flex justify-content-between lh-sm">
                                <div>
                                    <h6 className="my-0">{item.name}</h6>
                                    <small className="text-muted">Cantidad: {item.quantity}</small>
                                </div>
                                <span className="text-muted">${(item.price * item.quantity).toLocaleString('es-CL')}</span>
                            </li>
                        ))}
                        <li className="list-group-item d-flex justify-content-between">
                            <strong>Total (CLP)</strong>
                            <strong>${cartTotal.toLocaleString('es-CL')}</strong>
                        </li>
                    </ul>
                </div>

                {/* Columna del Formulario (basado en Figura 6) */}
                <div className="col-md-7 col-lg-8">
                    <h4 className="mb-3 product-title">Información del Cliente</h4>
                    <form onSubmit={handlePagar}>
                        <div className="row g-3">
                            <div className="col-sm-6 form-group">
                                <label htmlFor="nombre" className="form-label">Nombre</label>
                                <input type="text" className="form-control" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                            </div>
                            <div className="col-sm-6 form-group">
                                <label htmlFor="apellidos" className="form-label">Apellidos</label>
                                <input type="text" className="form-control" id="apellidos" value={apellidos} onChange={(e) => setApellidos(e.target.value)} required />
                            </div>
                            <div className="col-12 form-group">
                                <label htmlFor="correo" className="form-label">Correo</label>
                                <input type="email" className="form-control" id="correo" placeholder="tu@email.com" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
                            </div>
                            <div className="col-12 form-group">
                                <label htmlFor="calle" className="form-label">Calle</label>
                                <input type="text" className="form-control" id="calle" placeholder="Av. Siempre Viva 123" required />
                            </div>
                            <div className="col-md-5 form-group">
                                <label htmlFor="region" className="form-label">Región</label>
                                <select className="form-select" id="region" required>
                                    <option value="">Seleccionar...</option>
                                    <option>Metropolitana de Santiago</option>
                                    {/* ... (otras regiones) ... */}
                                </select>
                            </div>
                            <div className="col-md-4 form-group">
                                <label htmlFor="comuna" className="form-label">Comuna</label>
                                <select className="form-select" id="comuna" required>
                                    <option value="">Seleccionar...</option>
                                    <option>Cerrillos</option>
                                    {/* ... (otras comunas) ... */}
                                </select>
                            </div>
                        </div>

                        <hr className="my-4" />

                        <button className="w-100 btn btn-primary btn-lg" type="submit">
                            Pagar ahora ${cartTotal.toLocaleString('es-CL')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;