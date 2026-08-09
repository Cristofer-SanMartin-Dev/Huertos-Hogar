import React, { useEffect, useState } from 'react';
import adminStatsService from '../../services/adminStatsService.js';

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        adminStatsService.getUsers()
            .then(response => setUsers(response.data))
            .catch(err => {
                console.error('Error al cargar los usuarios:', err);
                setError('No se pudieron cargar los usuarios.');
            });
    }, []);

    return (
        <div className="container mt-4">
            <h2>Usuarios Registrados</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="table-responsive">
                <table className="table table-striped align-middle">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Teléfono</th>
                            <th>Rol</th>
                            <th>Puntos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.nombre} {user.apellidos}</td>
                                    <td>{user.email}</td>
                                    <td>{user.telefono || 'No especificado'}</td>
                                    <td>
                                        <span className={`badge ${user.role === 'ADMIN' ? 'bg-success' : 'bg-secondary'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>{user.puntos ?? 0}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center text-muted">Sin usuarios registrados.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsersPage;
