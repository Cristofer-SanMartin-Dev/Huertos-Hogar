import React, { useEffect, useState } from 'react';
import ProductService from '../../services/productService.js';

// Las categorías son un campo de texto en Product, no una entidad propia,
// así que esta vista agrupa los productos ya cargados en vez de pedir
// datos nuevos al backend.
const AdminCategoriesPage = () => {
    const [categorias, setCategorias] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        ProductService.getAllProducts()
            .then(response => {
                const productos = response.data;
                const grupos = {};
                productos.forEach(p => {
                    const categoria = p.category || 'Sin categoría';
                    if (!grupos[categoria]) {
                        grupos[categoria] = { nombre: categoria, cantidadProductos: 0, stockTotal: 0 };
                    }
                    grupos[categoria].cantidadProductos += 1;
                    grupos[categoria].stockTotal += p.stock || 0;
                });
                setCategorias(Object.values(grupos));
            })
            .catch(err => {
                console.error('Error al cargar las categorías:', err);
                setError('No se pudieron cargar las categorías.');
            });
    }, []);

    return (
        <div className="container mt-4">
            <h2>Categorías</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row">
                {categorias.length > 0 ? (
                    categorias.map(cat => (
                        <div key={cat.nombre} className="col-md-3 mb-3">
                            <div className="card text-center h-100">
                                <div className="card-body">
                                    <h5 className="product-title">{cat.nombre}</h5>
                                    <p className="mb-1"><strong>{cat.cantidadProductos}</strong> producto(s)</p>
                                    <p className="text-muted mb-0">{cat.stockTotal} unidades en stock</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-muted">Aún no hay productos para agrupar por categoría.</p>
                )}
            </div>
        </div>
    );
};

export default AdminCategoriesPage;
