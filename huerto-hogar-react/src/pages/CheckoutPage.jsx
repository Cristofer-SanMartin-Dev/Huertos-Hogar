// Ruta: src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // Importa useAuth

const CheckoutPage = () => {
    const { cart, clearCart } = useCart(); // Obtiene el carrito
    const navigate = useNavigate();
    const { user } = useAuth(); // Obtén el usuario del contexto

    // Calcula el total del carrito
    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    // Estados para el formulario
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [correo, setCorreo] = useState('');
    const [calle, setCalle] = useState('');
    const [region, setRegion] = useState('');
    const [comuna, setComuna] = useState('');

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

    // Lógica de pago
    const handlePagar = (e) => {
        e.preventDefault();
        if (nombre.toLowerCase() === 'error') {
            navigate('/pago-error');
        } else {
            clearCart();
            navigate('/pago-exitoso');
        }
    };

    return (
        <div className="container py-5">
            <h2 className="mb-4 section-title">Completa tu Compra</h2>
            <div className="row g-5">
                
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