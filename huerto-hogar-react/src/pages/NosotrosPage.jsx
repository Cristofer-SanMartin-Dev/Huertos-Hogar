import React from 'react';

// TUTOR: Esta página es para la ruta /nosotros[cite: 879].
// Reutilizamos el contenido que estaba en HomePage.
const NosotrosPage = () => {
    return (
        <section className="container py-5">
            <div className="row">
                <div className="col-lg-8 mx-auto text-center">
                    <h2 className="section-title">¿Quiénes Somos?</h2>
                    <p className="lead text-muted">
                        <strong>HuertoHogar</strong> es una tienda online dedicada a llevar la frescura y calidad de los productos del campo directamente a la puerta de nuestros clientes en Chile.
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
        </section>
    );
};

export default NosotrosPage;