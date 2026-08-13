// Ruta: src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react'; // 1. Importa useState y useEffect
import { useAuth } from '../context/AuthContext.js';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import orderService from '../services/orderService.js';
import RegionComunaSelect from '../components/RegionComunaSelect.jsx';

const ProfilePage = () => {
  // 2. Obtén 'updateUser' del contexto
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    orderService.getMine()
      .then(response => setOrders(response.data))
      .catch(err => console.error('Error al cargar el historial de pedidos:', err));
  }, []);

  // 3. Crea estados locales para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    calle: '',
    region: '',
    comuna: '',
    telefono: ''
  });
  const [isEditing, setIsEditing] = useState(false); // Estado para saber si estamos editando
  const [isLoading, setIsLoading] = useState(false); // Para deshabilitar el botón al guardar
  const [error, setError] = useState(''); // Para mostrar errores de guardado
  const [fieldErrors, setFieldErrors] = useState({});

  // Mismas reglas que valida el backend (AuthService.validarActualizacionPerfil).
  const NOMBRE_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,}$/;
  // Solo 9 dígitos (celular sin código de país) o 12 caracteres con el +56 incluido.
  const TELEFONO_REGEX = /^\d{9}$|^\+\d{11}$/;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio.';
    } else if (!NOMBRE_REGEX.test(formData.nombre.trim())) {
      newErrors.nombre = 'El nombre debe tener solo letras y al menos 2 caracteres.';
    }

    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'Los apellidos son obligatorios.';
    } else if (!NOMBRE_REGEX.test(formData.apellidos.trim())) {
      newErrors.apellidos = 'Los apellidos deben tener solo letras y al menos 2 caracteres.';
    }

    if (!formData.calle.trim()) {
      newErrors.calle = 'La calle es obligatoria.';
    } else if (formData.calle.trim().length < 3) {
      newErrors.calle = 'La calle debe tener al menos 3 caracteres.';
    }

    if (!formData.region.trim()) newErrors.region = 'La región es obligatoria.';
    if (!formData.comuna.trim()) newErrors.comuna = 'La comuna es obligatoria.';

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El número de contacto es obligatorio.';
    } else if (!TELEFONO_REGEX.test(formData.telefono.trim())) {
      newErrors.telefono = 'El teléfono debe tener 9 dígitos (ej: 912345678) o incluir el +56 (ej: +56912345678).';
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 4. Llena el estado del formulario cuando el 'user' cargue
  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        apellidos: user.apellidos || '',
        calle: user.calle || '',
        region: user.region || '',
        comuna: user.comuna || '',
        telefono: user.telefono || ''
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

  const setRegion = (value) => setFormData(prevData => ({ ...prevData, region: value }));
  const setComuna = (value) => setFormData(prevData => ({ ...prevData, comuna: value }));

  // 6. Manejador para guardar el formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    updateUser(formData)
      .then(() => {
        setIsLoading(false);
        setIsEditing(false); // Cierra el modo edición
        toast.success('¡Perfil actualizado con éxito!');
      })
      .catch(err => {
        setIsLoading(false);
        setError(err.response?.data || 'Error al guardar los cambios. Inténtalo de nuevo.');
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
                    <input type="text" id="nombre" name="nombre" className={`form-control ${fieldErrors.nombre ? 'is-invalid' : ''}`} value={formData.nombre} onChange={handleChange} />
                    {fieldErrors.nombre && <div className="invalid-feedback">{fieldErrors.nombre}</div>}
                  </div>
                  <div className="form-group mb-2">
                    <label htmlFor="apellidos" className="form-label">Apellidos:</label>
                    <input type="text" id="apellidos" name="apellidos" className={`form-control ${fieldErrors.apellidos ? 'is-invalid' : ''}`} value={formData.apellidos} onChange={handleChange} />
                    {fieldErrors.apellidos && <div className="invalid-feedback">{fieldErrors.apellidos}</div>}
                  </div>
                  <div className="form-group mb-2">
                    <label htmlFor="email" className="form-label">Email (no editable):</label>
                    <input type="email" id="email" name="email" className="form-control" value={user.email} disabled />
                  </div>
                  <div className="form-group mb-2">
                    <label htmlFor="telefono" className="form-label">Número de Contacto:</label>
                    <input type="tel" id="telefono" name="telefono" className={`form-control ${fieldErrors.telefono ? 'is-invalid' : ''}`} value={formData.telefono} onChange={handleChange} />
                    {fieldErrors.telefono && <div className="invalid-feedback">{fieldErrors.telefono}</div>}
                  </div>
                  <hr />
                  <p><strong>Dirección de Despacho:</strong></p>
                  <div className="form-group mb-2">
                    <label htmlFor="calle" className="form-label">Calle:</label>
                    <input type="text" id="calle" name="calle" className={`form-control ${fieldErrors.calle ? 'is-invalid' : ''}`} value={formData.calle} onChange={handleChange} />
                    {fieldErrors.calle && <div className="invalid-feedback">{fieldErrors.calle}</div>}
                  </div>
                  <div className="row mb-3">
                    <RegionComunaSelect
                      region={formData.region}
                      comuna={formData.comuna}
                      onRegionChange={setRegion}
                      onComunaChange={setComuna}
                      regionError={fieldErrors.region}
                      comunaError={fieldErrors.comuna}
                    />
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
                  <p><strong>Número de Contacto:</strong> {user.telefono || 'No especificado'}</p>
                  <p><strong>Puntos de Fidelidad:</strong> {user.puntos ?? 0}</p>
                  <hr />
                  <p><strong>Dirección de Despacho:</strong></p>
                  <p>{user.calle || 'No especificada'}</p>
                  <p>{user.comuna || 'No especificada'}, {user.region || 'No especificada'}</p>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Historial de Compras real */}
        <div className="col-md-6 mt-4 mt-md-0">
          <div className="card">
            <div className="card-header">Historial de Compras</div>
            <ul className="list-group list-group-flush">
              {orders.length > 0 ? (
                orders.map(order => (
                  <li key={order.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Pedido #{order.id}</strong>
                      <small className="text-muted d-block">
                        {new Date(order.fecha).toLocaleDateString('es-CL')} — {order.estado}
                      </small>
                    </div>
                    <div className="text-end">
                      <div>${order.total.toLocaleString('es-CL')}</div>
                      <Link to={`/pedidos/${order.id}`} className="small">Ver detalle</Link>
                    </div>
                  </li>
                ))
              ) : (
                <li className="list-group-item text-muted">Aún no tienes pedidos.</li>
              )}
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