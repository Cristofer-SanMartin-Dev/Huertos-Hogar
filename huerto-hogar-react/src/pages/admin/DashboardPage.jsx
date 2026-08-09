import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import adminStatsService from '../../services/adminStatsService.js';

const DashboardPage = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        adminStatsService.getStats()
            .then(response => setStats(response.data))
            .catch(err => console.error('Error al cargar las estadísticas:', err));
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
