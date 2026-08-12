import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ResponsiveContainer, LineChart, Line, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import adminStatsService from '../../services/adminStatsService.js';
import ProductService from '../../services/productService.js';

// Colores de marca de HuertoHogar (mismo verde que btn-primary/bg-success en el resto del panel).
const COLOR_PRIMARIO = '#2e7d32';
const COLOR_SECUNDARIO = '#81c784';

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [reports, setReports] = useState(null);
    const [stockPorCategoria, setStockPorCategoria] = useState([]);

    useEffect(() => {
        adminStatsService.getStats()
            .then(response => setStats(response.data))
            .catch(err => console.error('Error al cargar las estadísticas:', err));

        adminStatsService.getReports()
            .then(response => setReports(response.data))
            .catch(err => console.error('Error al cargar los reportes:', err));

        ProductService.getAllProducts()
            .then(response => {
                const grupos = {};
                response.data.forEach(p => {
                    const categoria = p.category || 'Sin categoría';
                    grupos[categoria] = (grupos[categoria] || 0) + (p.stock || 0);
                });
                setStockPorCategoria(Object.entries(grupos).map(([categoria, stock]) => ({ categoria, stock })));
            })
            .catch(err => console.error('Error al cargar el stock por categoría:', err));
    }, []);

    return (
        <div>
            <h2 className="section-title mb-4">Dashboard</h2>
            <h5 className="mb-4">Resumen de las actividades</h5>

            {/* Tarjetas de Resumen */}
            <div className="row">
                <div className="col-md-3">
                    <div className="card text-white bg-primary mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Pedidos</h5>
                            <p className="card-text fs-3">{stats ? stats.totalOrders : '...'}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-white bg-success mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Productos</h5>
                            <p className="card-text fs-3">{stats ? stats.totalProducts : '...'}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-white bg-warning mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Usuarios</h5>
                            <p className="card-text fs-3">{stats ? stats.totalUsers : '...'}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-white bg-info mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Ingresos</h5>
                            <p className="card-text fs-3">
                                {stats ? `$${stats.totalRevenue.toLocaleString('es-CL')}` : '...'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gráficos: para hacer seguimiento y tomar decisiones (stock a reponer, categorías que más venden) */}
            <div className="row">
                <div className="col-md-7 mb-4">
                    <div className="card h-100">
                        <div className="card-header">Ventas por día</div>
                        <div className="card-body">
                            {reports && reports.salesByDate.length > 0 ? (
                                <ResponsiveContainer width="100%" height={280}>
                                    <LineChart data={reports.salesByDate}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip formatter={(value) => `$${Number(value).toLocaleString('es-CL')}`} />
                                        <Line type="monotone" dataKey="total" name="Ventas" stroke={COLOR_PRIMARIO} strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-muted mb-0">Todavía no hay pedidos para graficar.</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-md-5 mb-4">
                    <div className="card h-100">
                        <div className="card-header">Ingresos por categoría</div>
                        <div className="card-body">
                            {reports && reports.revenueByCategory.length > 0 ? (
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={reports.revenueByCategory}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip formatter={(value) => `$${Number(value).toLocaleString('es-CL')}`} />
                                        <Bar dataKey="value" name="Ingresos" fill={COLOR_PRIMARIO} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-muted mb-0">Todavía no hay ventas para graficar.</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-md-12 mb-4">
                    <div className="card">
                        <div className="card-header">Stock por categoría</div>
                        <div className="card-body">
                            {stockPorCategoria.length > 0 ? (
                                <ResponsiveContainer width="100%" height={260}>
                                    <BarChart data={stockPorCategoria} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" tick={{ fontSize: 12 }} />
                                        <YAxis type="category" dataKey="categoria" width={150} tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="stock" name="Unidades en stock" fill={COLOR_SECUNDARIO} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-muted mb-0">Todavía no hay productos para graficar.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Accesos Directos */}
            <h5 className="my-4">Accesos Directos</h5>
            <div className="row">
                <div className="col-md-4 mb-3">
                    <div className="card">
                        <div className="card-body text-center">
                            <h5 className="product-title">Productos</h5>
                            <p>Gestionar inventario y detalles.</p>
                            <Link to="/admin/productos" className="btn btn-primary">Ir a Productos</Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="card">
                        <div className="card-body text-center">
                            <h5 className="product-title">Órdenes</h5>
                            <p>Ver y gestionar órdenes de compra.</p>
                            <Link to="/admin/ordenes" className="btn btn-primary">Ir a Órdenes</Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="card">
                        <div className="card-body text-center">
                            <h5 className="product-title">Usuarios</h5>
                            <p>Gestionar cuentas de clientes.</p>
                            <Link to="/admin/usuarios" className="btn btn-primary">Ir a Usuarios</Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="card">
                        <div className="card-body text-center">
                            <h5 className="product-title">Mensajes</h5>
                            <p>Revisar mensajes de contacto.</p>
                            <Link to="/admin/mensajes" className="btn btn-primary">Ir a Mensajes</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
