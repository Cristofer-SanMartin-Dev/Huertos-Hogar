// Ruta: src/pages/ProfilePage.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); 
  };

  if (!user) {
    return <div className="container py-5 text-center">Cargando perfil...</div>;
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 section-title">Mi Perfil</h2>
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Información Personal</div>
            <div className="card-body">
              {/* --- DATOS DE PERFIL MODIFICADOS --- */}
              <p><strong>Nombre:</strong> {user.nombre}</p>
              <p><strong>Apellidos:</strong> {user.apellidos}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <hr />
              <p><strong>Dirección de Despacho:</strong></p>
              <p>{user.calle}</p>
              <p>{user.comuna}, {user.region}</p>
              {/* --- FIN DE MODIFICADOS --- */}
              <button className="btn btn-sm btn-outline-secondary mt-2">Editar Información</button>
            </div>
          </div>
        </div>
        <div className="col-md-6 mt-4 mt-md-0">
          {/* ... (Historial de Compras - sin cambios) ... */}
          <div className="card">
            <div className="card-header">Historial de Compras (Simulado)</div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <p className="mb-1"><strong>Pedido #12345</strong> - 25/08/2025</p>
                <span className="badge bg-success">Entregado</span>
              </li>
              <li className="list-group-item">
                <p className="mb-1"><strong>Pedido #12348</strong> - 01/09/2025</p>
                <span className="badge bg-warning text-dark">En preparación</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <button onClick={handleLogout} className="btn btn-danger">
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;