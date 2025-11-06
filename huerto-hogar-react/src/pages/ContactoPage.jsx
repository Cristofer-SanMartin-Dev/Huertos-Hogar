import React from 'react';

// TUTOR: Esta página es para la ruta /contacto.
const ContactoPage = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('¡Mensaje enviado! Gracias por contactarnos.');
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="login-container" style={{maxWidth: '100%'}}>
                        <h2 className="text-center section-title">Contáctanos</h2>
                        <p className="text-center text-muted mb-4">¿Tienes dudas o sugerencias? Escríbenos.</p>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Nombre</label>
                                <input type="text" id="name" className="form-control" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Correo</label>
                                <input type="email" id="email" className="form-control" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Mensaje</label>
                                <textarea id="message" className="form-control" rows="5" required></textarea>
                            </div>
                            <div className="d-grid mt-4">
                                <button type="submit" className="btn btn-primary">Enviar Mensaje</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactoPage;