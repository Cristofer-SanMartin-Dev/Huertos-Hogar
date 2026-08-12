import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProductService from '../../services/productService';

const AdminProductListPage = () => {
    const [products, setProducts] = useState([]);

    const loadProducts = () => {
        ProductService.getAllProducts()
            .then(response => setProducts(response.data))
            .catch(error => console.error("Error cargando productos", error));
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleDelete = (id) => {
        const producto = products.find(p => p.id === id);
        const nombre = producto ? producto.name : 'Producto';

        if (window.confirm(`¿Estás seguro de eliminar "${nombre}"? Esta acción no se puede deshacer.`)) {
            ProductService.deleteProduct(id)
                .then(() => {
                    loadProducts(); // Recargar lista
                    toast.success(`"${nombre}" se eliminó del catálogo.`);
                })
                .catch(err => {
                    console.error('Error al eliminar el producto:', err);
                    toast.error(err.response?.data || `No se pudo eliminar "${nombre}". Inténtalo de nuevo.`);
                });
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestión de Productos</h2>
                <Link to="/admin/productos/nuevo" className="btn btn-primary">
                    + Nuevo Producto
                </Link>
            </div>

            <div className="table-responsive">
            <table className="table table-striped align-middle">
                <thead>
                    <tr>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Categoría</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>
                                <img 
                                    src={ProductService.getImageUrl(product.imageName)} 
                                    alt={product.name} 
                                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                                />
                            </td>
                            <td>{product.name}</td>
                            <td>${product.price}</td>
                            <td>{product.stock}</td>
                            <td>{product.category}</td>
                            <td>
                                <Link to={`/admin/productos/editar/${product.id}`} className="btn btn-sm btn-warning me-2">
                                    Editar
                                </Link>
                                <button onClick={() => handleDelete(product.id)} className="btn btn-sm btn-danger">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
};

export default AdminProductListPage;