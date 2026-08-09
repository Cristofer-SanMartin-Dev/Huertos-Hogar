// src/pages/OrderDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import orderService from '../services/orderService.js';

const ESTADOS = ['PENDIENTE', 'PREPARANDO', 'ENVIADO', 'ENTREGADO'];

const OrderDetailPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        orderService.getById(id)
            .then(response => setOrder(response.data))
            .catch(err => {
                console.error('Error al cargar el pedido:', err);
                setError(err.response?.data || 'No se pudo cargar el pedido.');
            });
    }, [id]);

    if (error) {
        return <div className="container py-5"><div className="alert alert-danger">{error}</div></div>;
    }

    if (!order) {
        return <div className="container py-5 text-center">Cargando pedido...</div>;
    }

    const pasoActual = ESTADOS.indexOf(order.estado);
    const esCancelado = order.estado === 'CANCELADO';

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4 no-print">
                <h2 className="section-title mb-0">Pedido #{order.id}</h2>
                <button className="btn btn-outline-secondary" onClick={() => window.print()}>
                    Imprimir boleta
                </button>
            </div>

            {/* Seguimiento del pedido */}
            {!esCancelado ? (
                <div className="d-flex justify-content-between mb-5 no-print">
                    {ESTADOS.map((estado, index) => (
                        <div key={estado} className="text-center flex-fill">
                            <div
                                className={`rounded-circle mx-auto mb-1 d-flex align-items-center justify-content-center ${index <= pasoActual ? 'bg-success text-white' : 'bg-light text-muted border'}`}
                                style={{ width: '2.5rem', height: '2.5rem' }}
                            >
                                {index + 1}
                            </div>
                            <small className={index <= pasoActual ? 'fw-bold' : 'text-muted'}>{estado}</small>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="alert alert-danger">Este pedido fue cancelado.</div>
            )}

            {/* Boleta */}
            <div className="card">
                <div className="card-body">
                    <h4 className="product-title">Boleta</h4>
                    <p className="text-muted mb-1">Fecha: {new Date(order.fecha).toLocaleString('es-CL')}</p>
                    <p className="text-muted">
                        Envío a: {order.calleEnvio}, {order.comunaEnvio}, {order.regionEnvio}
                        {order.fechaEntregaPreferida && ` — Entrega preferida: ${order.fechaEntregaPreferida}`}
                    </p>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th className="text-end">Precio Unitario</th>
                                <th className="text-end">Cantidad</th>
                                <th className="text-end">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.productName}</td>
                                    <td className="text-end">${item.unitPrice.toLocaleString('es-CL')}</td>
                                    <td className="text-end">{item.quantity}</td>
                                    <td className="text-end">${item.subtotal.toLocaleString('es-CL')}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th colSpan="3" className="text-end">Total</th>
                                <th className="text-end">${order.total.toLocaleString('es-CL')}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <div className="mt-4 no-print">
                <Link to="/perfil" className="btn btn-outline-secondary">Volver a Mi Perfil</Link>
            </div>
        </div>
    );
};

export default OrderDetailPage;
