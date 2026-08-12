import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import orderService from '../../services/orderService.js';

const ESTADOS = ['PENDIENTE', 'PREPARANDO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');

    const loadOrders = () => {
        orderService.getAll()
            .then(response => setOrders(response.data))
            .catch(err => {
                console.error('Error al cargar los pedidos:', err);
                setError('No se pudieron cargar los pedidos.');
            });
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleStatusChange = (orderId, nuevoEstado) => {
        orderService.updateStatus(orderId, nuevoEstado)
            .then(() => {
                loadOrders();
                toast.success(`Pedido #${orderId} actualizado a ${nuevoEstado}.`);
            })
            .catch(err => {
                console.error('Error al actualizar el estado:', err);
                toast.error('No se pudo actualizar el estado del pedido.');
            });
    };

    return (
        <div className="container mt-4">
            <h2>Gestión de Pedidos</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="table-responsive">
                <table className="table table-striped align-middle">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Detalle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map(order => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>{new Date(order.fecha).toLocaleDateString('es-CL')}</td>
                                    <td>${order.total.toLocaleString('es-CL')}</td>
                                    <td>
                                        <select
                                            className="form-select form-select-sm"
                                            value={order.estado}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        >
                                            {ESTADOS.map(estado => (
                                                <option key={estado} value={estado}>{estado}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <Link to={`/admin/ordenes/${order.id}`} className="btn btn-sm btn-outline-secondary">
                                            Ver
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center text-muted">Sin pedidos todavía.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrdersPage;
