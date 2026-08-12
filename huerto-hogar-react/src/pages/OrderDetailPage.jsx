// src/pages/OrderDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import orderService from '../services/orderService.js';

const ESTADOS = ['PENDIENTE', 'PREPARANDO', 'ENVIADO', 'ENTREGADO'];

const OrderDetailPage = () => {
    const { id } = useParams();
    // Este componente se monta tanto en /pedidos/:id (cliente viendo su
    // propio pedido) como en /admin/ordenes/:id (admin viendo cualquier
    // pedido, dentro del panel): el botón de volver depende de cuál es.
    const { pathname } = useLocation();
    const esVistaAdmin = pathname.startsWith('/admin');
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
                    <div className="d-flex align-items-center border-bottom pb-3 mb-3">
                        <img
                            src="/assets/logo-huertohogar.png"
                            alt="HuertoHogar"
                            style={{ height: '56px', width: 'auto' }}
                            className="me-3"
                        />
                        <div>
                            <h4 className="product-title mb-0">Boleta de Compra</h4>
                            <small className="text-muted">Pedido #{order.id}</small>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-sm-6 mb-2">
                            <strong className="d-block">Fecha</strong>
                            <span className="text-muted">{new Date(order.fecha).toLocaleString('es-CL')}</span>
                        </div>
                        <div className="col-sm-6 mb-2">
                            <strong className="d-block">Envío a</strong>
                            <span className="text-muted">{order.calleEnvio}, {order.comunaEnvio}, {order.regionEnvio}</span>
                        </div>
                        {order.fechaEntregaPreferida && (
                            <div className="col-sm-6">
                                <strong className="d-block">Entrega preferida</strong>
                                <span className="text-muted">{order.fechaEntregaPreferida}</span>
                            </div>
                        )}
                    </div>
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
                {esVistaAdmin ? (
                    <Link to="/admin/ordenes" className="btn btn-outline-secondary">Volver a Órdenes</Link>
                ) : (
                    <Link to="/perfil" className="btn btn-outline-secondary">Volver a Mi Perfil</Link>
                )}
            </div>
        </div>
    );
};

export default OrderDetailPage;
