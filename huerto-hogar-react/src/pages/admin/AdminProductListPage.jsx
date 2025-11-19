import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
        if (window.confirm('¿Estás seguro de eliminar este producto?')) {
            ProductService.deleteProduct(id)
                .then(() => loadProducts()) // Recargar lista
                .catch(err => alert('Error al eliminar'));
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
    );
};

export default AdminProductListPage;