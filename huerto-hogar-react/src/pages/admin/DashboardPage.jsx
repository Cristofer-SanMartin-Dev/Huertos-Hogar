import React from 'react';
import { Link } from 'react-router-dom';

// TUTOR: Esta es la página principal del Dashboard (Figura 9).
// Por ahora, tiene datos estáticos.
const DashboardPage = () => {
    return (
        <div>
            <h2 className="section-title mb-4">Dashboard</h2>
            <h5 className="mb-4">Resumen de las actividades</h5>

            {/* Tarjetas de Resumen (Figura 9) */}
            <div className="row">
                <div className="col-md-4">
                    <div className="card text-white bg-primary mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Compras</h5>
                            <p className="card-text fs-3">1,234</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-success mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Productos</h5>
                            <p className="card-text fs-3">400</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-warning mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Usuarios</h5>
                            <p className="card-text fs-3">890</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Accesos Directos (Figura 9) */}
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
            </div>
        </div>
    );
};

export default DashboardPage;