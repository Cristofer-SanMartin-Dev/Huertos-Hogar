import React, { useState } from 'react';
import contactService from '../services/contactService.js';

const ContactoPage = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [feedback, setFeedback] = useState(null); // { type: 'success' | 'danger', text }
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setFeedback(null);
        setIsSubmitting(true);

        contactService.send({ nombre, email, mensaje })
            .then(() => {
                setFeedback({ type: 'success', text: '¡Mensaje enviado! Gracias por contactarnos.' });
                setNombre('');
                setEmail('');
                setMensaje('');
            })
            .catch(error => {
                console.error('Error al enviar el mensaje de contacto:', error);
                setFeedback({ type: 'danger', text: 'No se pudo enviar el mensaje. Inténtalo de nuevo.' });
            })
            .finally(() => setIsSubmitting(false));
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
                                <input type="text" id="name" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Correo</label>
                                <input type="email" id="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Mensaje</label>
                                <textarea id="message" className="form-control" rows="5" value={mensaje} onChange={(e) => setMensaje(e.target.value)} required></textarea>
                            </div>
                            {feedback && (
                                <div className={`alert alert-${feedback.type} mt-3`}>{feedback.text}</div>
                            )}
                            <div className="d-grid mt-4">
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactoPage;
