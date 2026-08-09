import React from 'react';

const sucursales = [
    { ciudad: 'Santiago', region: 'Región Metropolitana' },
    { ciudad: 'Puerto Montt', region: 'Región de Los Lagos' },
    { ciudad: 'Villarica', region: 'Región de La Araucanía' },
    { ciudad: 'Nacimiento', region: 'Región del Biobío' },
    { ciudad: 'Viña del Mar', region: 'Región de Valparaíso' },
    { ciudad: 'Valparaíso', region: 'Región de Valparaíso' },
    { ciudad: 'Concepción', region: 'Región del Biobío' },
];

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
                    <div className="card h-100 p-3">
                        <h4 className="text-center" style={{color: 'var(--accent-green)'}}>Nuestra Misión</h4>
                        <p>Proporcionar productos frescos y de calidad directamente desde el campo, garantizando la frescura y el sabor en cada entrega. Nos comprometemos a fomentar una conexión más cercana entre los consumidores y los agricultores locales.</p>
                    </div>
                </div>
                <div className="col-md-6 mt-3 mt-md-0">
                    <div className="card h-100 p-3">
                        <h4 className="text-center" style={{color: 'var(--accent-green)'}}>Nuestra Visión</h4>
                        <p>Ser la tienda online líder en la distribución de productos frescos y naturales en Chile, reconocida por nuestra calidad excepcional, servicio al cliente y compromiso con la sostenibilidad.</p>
                    </div>
                </div>
            </div>

            {/* Sucursales: HuertoHogar opera en 9 puntos del país, sin API de mapas
                de pago disponible se muestran como tarjetas en vez de un mapa embebido
                que solo puede centrarse en una ubicación a la vez. */}
            <div className="row mt-5">
                <div className="col-12 text-center mb-4">
                    <h3 className="section-title">Nuestras Sucursales</h3>
                    <p className="text-muted">Encuéntranos en nuestros puntos de retiro a lo largo del país.</p>
                </div>
                {sucursales.map(sucursal => (
                    <div key={sucursal.ciudad} className="col-6 col-md-4 col-lg-3 mb-3">
                        <div className="card h-100 text-center p-3">
                            <div className="fs-3 mb-1">📍</div>
                            <h6 className="mb-0" style={{fontFamily: 'var(--font-header)'}}>{sucursal.ciudad}</h6>
                            <small className="text-muted">{sucursal.region}</small>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default NosotrosPage;
