// Ruta: src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react'; // 1. Importa useState y useEffect
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  // 2. Obtén 'updateUser' del contexto
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  // 3. Crea estados locales para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    calle: '',
    region: '',
    comuna: ''
  });
  const [isEditing, setIsEditing] = useState(false); // Estado para saber si estamos editando
  const [isLoading, setIsLoading] = useState(false); // Para deshabilitar el botón al guardar
  const [error, setError] = useState(''); // Para mostrar errores de guardado

  // 4. Llena el estado del formulario cuando el 'user' cargue
  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        apellidos: user.apellidos || '',
        calle: user.calle || '',
        region: user.region || '',
        comuna: user.comuna || ''
      });
    }
  }, [user]); // Se ejecuta cada vez que el objeto 'user' cambia

  const handleLogout = () => {
    logout();
    navigate('/'); 
  };

  // 5. Manejador para los cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // 6. Manejador para guardar el formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    updateUser(formData)
      .then(() => {
        setIsLoading(false);
        setIsEditing(false); // Cierra el modo edición
        alert('¡Perfil actualizado con éxito!');
      })
      .catch(err => {
        setIsLoading(false);
        setError('Error al guardar los cambios. Inténtalo de nuevo.');
        console.error(err);
      });
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
            <div className="card-header d-flex justify-content-between align-items-center">
              Información Personal
              {/* Botón para activar/cancelar la edición */}
              {!isEditing ? (
                <button 
                  className="btn btn-sm btn-outline-secondary" 
                  onClick={() => setIsEditing(true)}>
                  Editar Información
                </button>
              ) : (
                <button 
                  className="btn btn-sm btn-outline-danger" 
                  onClick={() => setIsEditing(false)}>
                  Cancelar
                </button>
              )}
            </div>
            <div className="card-body">
              {/* 7. Cambia el contenido a un formulario si está editando */}
              {isEditing ? (
                // --- MODO FORMULARIO ---
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-2">
                    <label htmlFor="nombre" className="form-label">Nombre:</label>
                    <input type="text" id="nombre" name="nombre" className="form-control" value={formData.nombre} onChange={handleChange} />
                  </div>
                  <div className="form-group mb-2">
                    <label htmlFor="apellidos" className="form-label">Apellidos:</label>
                    <input type="text" id="apellidos" name="apellidos" className="form-control" value={formData.apellidos} onChange={handleChange} />
                  </div>
                  <div className="form-group mb-2">
                    <label htmlFor="email" className="form-label">Email (no editable):</label>
                    <input type="email" id="email" name="email" className="form-control" value={user.email} disabled />
                  </div>
                  <hr />
                  <p><strong>Dirección de Despacho:</strong></p>
                  <div className="form-group mb-2">
                    <label htmlFor="calle" className="form-label">Calle:</label>
                    <input type="text" id="calle" name="calle" className="form-control" value={formData.calle} onChange={handleChange} />
                  </div>
                  <div className="form-group mb-2">
                    <label htmlFor="comuna" className="form-label">Comuna:</label>
                    <input type="text" id="comuna" name="comuna" className="form-control" value={formData.comuna} onChange={handleChange} />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="region" className="form-label">Región:</label>
                    <input type="text" id="region" name="region" className="form-control" value={formData.region} onChange={handleChange} />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                  {error && <div className="alert alert-danger mt-3">{error}</div>}
                </form>
              ) : (
                // --- MODO LECTURA (como estaba antes) ---
                <>
                  <p><strong>Nombre:</strong> {user.nombre}</p>
                  <p><strong>Apellidos:</strong> {user.apellidos}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <hr />
                  <p><strong>Dirección de Despacho:</strong></p>
                  <p>{user.calle || 'No especificada'}</p>
                  <p>{user.comuna || 'No especificada'}, {user.region || 'No especificada'}</p>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* ... (Columna de Historial de Compras - sin cambios) ... */}
        <div className="col-md-6 mt-4 mt-md-0">
          {/* ... (Historial de Compras - sin cambios) ... */}
          <div className="card">
            <div className="card-header">Historial de Compras (Simulado)</div>
            <ul className="list-group list-group-flush">
              {/* ... (items del historial) ... */}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Botón de Cerrar Sesión (sin cambios) */}
      <div className="mt-4 text-center">
        <button onClick={handleLogout} className="btn btn-danger">
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;