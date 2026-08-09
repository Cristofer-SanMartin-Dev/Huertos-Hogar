import React, { useEffect, useState } from 'react';
import contactService from '../../services/contactService.js';

const ContactMessagesPage = () => {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        contactService.getAll()
            .then(response => setMessages(response.data))
            .catch(err => {
                console.error('Error al cargar los mensajes de contacto:', err);
                setError('No se pudieron cargar los mensajes.');
            });
    }, []);

    return (
        <div className="container mt-4">
            <h2>Mensajes de Contacto</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="table-responsive">
                <table className="table table-striped align-middle">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Mensaje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages.length > 0 ? (
                            messages.map(message => (
                                <tr key={message.id}>
                                    <td>{new Date(message.fecha).toLocaleString('es-CL')}</td>
                                    <td>{message.nombre}</td>
                                    <td>{message.email}</td>
                                    <td>{message.mensaje}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center text-muted">Sin mensajes todavía.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ContactMessagesPage;
