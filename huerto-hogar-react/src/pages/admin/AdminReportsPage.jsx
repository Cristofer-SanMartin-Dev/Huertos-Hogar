import React, { useEffect, useState } from 'react';
import adminStatsService from '../../services/adminStatsService.js';

const AdminReportsPage = () => {
    const [reports, setReports] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        adminStatsService.getReports()
            .then(response => setReports(response.data))
            .catch(err => {
                console.error('Error al cargar los reportes:', err);
                setError('No se pudieron cargar los reportes.');
            });
    }, []);

    const renderTabla = (titulo, items, formatoValor) => (
        <div className="col-md-6 mb-3">
            <div className="card h-100">
                <div className="card-header">{titulo}</div>
                <ul className="list-group list-group-flush">
                    {items && items.length > 0 ? (
                        items.map((item, i) => (
                            <li key={i} className="list-group-item d-flex justify-content-between">
                                <span>{item.productName}</span>
                                <strong>{formatoValor(item.value)}</strong>
                            </li>
                        ))
                    ) : (
                        <li className="list-group-item text-muted">Aún no hay datos de pedidos.</li>
                    )}
                </ul>
            </div>
        </div>
    );

    return (
        <div className="container mt-4">
            <h2>Reportes</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {reports && (
                <div className="row">
                    {renderTabla('Productos Más Vendidos (por cantidad)', reports.topProductsByQuantity, v => `${v} unid.`)}
                    {renderTabla('Productos con Más Ingresos', reports.topProductsByRevenue, v => `$${v.toLocaleString('es-CL')}`)}
                </div>
            )}
        </div>
    );
};

export default AdminReportsPage;
