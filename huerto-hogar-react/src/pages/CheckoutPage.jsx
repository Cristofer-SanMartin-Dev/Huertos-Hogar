// Ruta: src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import orderService from '../services/orderService.js';

const manana = () => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 1);
    return fecha.toISOString().split('T')[0];
};

const CheckoutPage = () => {
    const { cart, clearCart } = useCart(); // Obtiene el carrito
    const navigate = useNavigate();
    const { user, refreshUser } = useAuth(); // Obtén el usuario del contexto

    // Calcula el total del carrito
    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    // Estados para el formulario
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [correo, setCorreo] = useState('');
    const [calle, setCalle] = useState('');
    const [region, setRegion] = useState('');
    const [comuna, setComuna] = useState('');
    const [fechaEntrega, setFechaEntrega] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Efecto para auto-completar el formulario si el usuario está logueado
    useEffect(() => {
        if (user) {
            setNombre(user.nombre || '');
            setApellidos(user.apellidos || '');
            setCorreo(user.email || '');
            setCalle(user.calle || '');
            setRegion(user.region || '');
            setComuna(user.comuna || '');
        }
    }, [user]); // Se ejecuta cuando 'user' carga o cambia

    // Crea el pedido real en el backend: el precio de cada ítem lo recalcula
    // el servidor a partir del producto vigente, nunca de lo que envía el cliente.
    const handlePagar = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            items: cart.map(item => ({ productId: item.id, cantidad: item.quantity })),
            calle,
            region,
            comuna,
            fechaEntregaPreferida: fechaEntrega || null,
        };

        orderService.create(payload)
            .then(response => {
                clearCart();
                // El pedido suma puntos de fidelidad en el servidor; refresca
                // el usuario en caché para que el perfil los muestre al tiro.
                refreshUser().catch(err => console.error('Error al refrescar el usuario:', err));
                navigate('/pago-exitoso', { state: { orderId: response.data.id } });
            })
            .catch(error => {
                console.error('Error al crear el pedido:', error);
                navigate('/pago-error', {
                    state: { message: error.response?.data || 'No se pudo procesar el pedido.' },
                });
            })
            .finally(() => setIsSubmitting(false));
    };

    return (
        <div className="container py-5">
            <h2 className="mb-4 section-title">Completa tu Compra</h2>
            <div className="row g-3 g-md-5">

                {/* --- SECCIÓN DEL CARRITO (RESTAURADA) --- */}
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
                {/* --- FIN DE LA SECCIÓN DEL CARRITO --- */}

                {/* Columna del Formulario (controlado y auto-completado) */}
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
                                <input type="email" className="form-control" id="correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
                            </div>
                            <div className="col-12 form-group">
                                <label htmlFor="calle" className="form-label">Calle</label>
                                <input type="text" className="form-control" id="calle" value={calle} onChange={(e) => setCalle(e.target.value)} required />
                            </div>
                            <div className="col-md-6 form-group">
                                <label htmlFor="region" className="form-label">Región</label>
                                <input type="text" className="form-control" id="region" value={region} onChange={(e) => setRegion(e.target.value)} required />
                            </div>
                            <div className="col-md-6 form-group">
                                <label htmlFor="comuna" className="form-label">Comuna</label>
                                <input type="text" className="form-control" id="comuna" value={comuna} onChange={(e) => setComuna(e.target.value)} required />
                            </div>
                            <div className="col-12 form-group">
                                <label htmlFor="fechaEntrega" className="form-label">Fecha de entrega preferida (opcional)</label>
                                <input type="date" className="form-control" id="fechaEntrega" min={manana()} value={fechaEntrega} onChange={(e) => setFechaEntrega(e.target.value)} />
                            </div>
                        </div>
                        <hr className="my-4" />
                        <button className="w-100 btn btn-primary btn-lg" type="submit" disabled={isSubmitting || cart.length === 0}>
                            {isSubmitting ? 'Procesando...' : `Pagar ahora $${cartTotal.toLocaleString('es-CL')}`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
