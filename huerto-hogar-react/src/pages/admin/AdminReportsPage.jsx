import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import adminStatsService from '../../services/adminStatsService.js';

const COLOR_PRIMARIO = '#2e7d32';

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

    const renderGrafico = (titulo, items, formatoValor) => (
        <div className="col-md-6 mb-3">
            <div className="card h-100">
                <div className="card-header">{titulo}</div>
                <div className="card-body">
                    {items && items.length > 0 ? (
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={items} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" tick={{ fontSize: 12 }} />
                                <YAxis type="category" dataKey="productName" width={140} tick={{ fontSize: 11 }} />
                                <Tooltip formatter={formatoValor} />
                                <Bar dataKey="value" fill={COLOR_PRIMARIO} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-muted mb-0">Aún no hay datos de pedidos.</p>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="container mt-4">
            <h2>Reportes</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {reports && (
                <div className="row">
                    {renderGrafico('Productos Más Vendidos (por cantidad)', reports.topProductsByQuantity, v => `${v} unid.`)}
                    {renderGrafico('Productos con Más Ingresos', reports.topProductsByRevenue, v => `$${v.toLocaleString('es-CL')}`)}
                </div>
            )}
        </div>
    );
};

export default AdminReportsPage;
