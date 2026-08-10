import React from 'react';
import BranchesMap from '../components/BranchesMap.jsx';
import { sucursales } from '../data/sucursales.js';

// TUTOR: Esta página es para la ruta /nosotros[cite: 879].
// Reutilizamos el contenido que estaba en HomePage.
const NosotrosPage = () => {
    return (
        <section className="container py-5">
            <div className="row">
                <div className="col-lg-8 mx-auto text-center">
                    <h2 className="section-title">¿Quiénes Somos?</h2>
                    <p className="lead text-muted">
                        <strong>HuertoHogar</strong> es una tienda online dedicada a llevar la frescura y calidad de los productos del campo directamente a la puerta de nuestros clientes en Chile. Trabajamos directamente con agricultores locales para asegurar que cada producto que llega a tu mesa sea fresco, saludable y cultivado con respeto por la tierra.
                    </p>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-md-6">
                    <div className="card h-100 p-3 hover-card">
                        <h4 className="text-center title-green">Nuestra Misión</h4>
                        <p>Proporcionar productos frescos y de calidad directamente desde el campo, garantizando la frescura y el sabor en cada entrega. Nos comprometemos a fomentar una conexión más cercana entre los consumidores y los agricultores locales.</p>
                    </div>
                </div>
                <div className="col-md-6 mt-3 mt-md-0">
                    <div className="card h-100 p-3 hover-card">
                        <h4 className="text-center title-green">Nuestra Visión</h4>
                        <p>Ser la tienda online líder en la distribución de productos frescos y naturales en Chile, reconocida por nuestra calidad excepcional, servicio al cliente y compromiso con la sostenibilidad.</p>
                    </div>
                </div>
            </div>

            {/* Sucursales: mapa interactivo con un pin clicable por ciudad
                (muestra región y horario al hacer clic), más una lista debajo
                para quienes prefieran verlas sin interactuar con el mapa. */}
            <div className="row mt-5">
                <div className="col-12 text-center mb-4">
                    <h3 className="section-title">Nuestras Sucursales</h3>
                    <p className="text-muted">Haz clic en un punto del mapa para ver la información de esa sucursal.</p>
                </div>
                <div className="col-12 mb-4">
                    <BranchesMap />
                </div>
                {sucursales.map(sucursal => (
                    <div key={sucursal.ciudad} className="col-6 col-md-4 col-lg-3 mb-3">
                        <div className="card h-100 text-center p-3 hover-card">
                            <div className="fs-3 mb-1">📍</div>
                            <h6 className="mb-0 product-title">{sucursal.ciudad}</h6>
                            <small className="text-muted d-block">{sucursal.region}</small>
                            <small className="text-muted">{sucursal.horario}</small>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default NosotrosPage;
