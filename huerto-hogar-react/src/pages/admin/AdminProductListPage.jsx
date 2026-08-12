import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProductService from '../../services/productService';
import ConfirmModal from '../../components/ConfirmModal.jsx';

const AdminProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [productToDelete, setProductToDelete] = useState(null);

    const loadProducts = () => {
        ProductService.getAllProducts()
            .then(response => setProducts(response.data))
            .catch(error => console.error("Error cargando productos", error));
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const confirmDelete = () => {
        const { id, name } = productToDelete;
        ProductService.deleteProduct(id)
            .then(() => {
                loadProducts(); // Recargar lista
                toast.success(`"${name}" se eliminó del catálogo.`);
            })
            .catch(err => {
                console.error('Error al eliminar el producto:', err);
                toast.error(err.response?.data || `No se pudo eliminar "${name}". Inténtalo de nuevo.`);
            })
            .finally(() => setProductToDelete(null));
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
                                <button onClick={() => setProductToDelete(product)} className="btn btn-sm btn-danger">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>

            <ConfirmModal
                show={!!productToDelete}
                title="Eliminar producto"
                message={`¿Estás seguro de eliminar "${productToDelete?.name}"? Esta acción no se puede deshacer.`}
                confirmLabel="Eliminar"
                variant="danger"
                onConfirm={confirmDelete}
                onCancel={() => setProductToDelete(null)}
            />
        </div>
    );
};

export default AdminProductListPage;
