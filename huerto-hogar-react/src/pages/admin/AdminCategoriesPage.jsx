import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CategoryService from '../../services/categoryService.js';
import ProductService from '../../services/productService.js';
import ConfirmModal from '../../components/ConfirmModal.jsx';

const AdminCategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');

    const [nombre, setNombre] = useState('');
    const [prefijo, setPrefijo] = useState('');
    const [guardando, setGuardando] = useState(false);

    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const loadAll = () => {
        Promise.all([CategoryService.getAllCategories(), ProductService.getAllProducts()])
            .then(([categoriesRes, productsRes]) => {
                setCategories(categoriesRes.data);
                setProducts(productsRes.data);
            })
            .catch(err => {
                console.error('Error al cargar categorías:', err);
                setError('No se pudieron cargar las categorías.');
            });
    };

    useEffect(() => {
        loadAll();
    }, []);

    const handleCrearCategoria = (e) => {
        e.preventDefault();
        if (!nombre.trim() || !prefijo.trim()) {
            toast.error('El nombre y el prefijo son obligatorios.');
            return;
        }
        setGuardando(true);
        CategoryService.createCategory(nombre.trim(), prefijo.trim())
            .then(() => {
                toast.success(`Categoría "${nombre}" creada.`);
                setNombre('');
                setPrefijo('');
                loadAll();
            })
            .catch(err => {
                toast.error(err.response?.data || 'No se pudo crear la categoría.');
            })
            .finally(() => setGuardando(false));
    };

    const confirmDelete = () => {
        const { id, name } = categoryToDelete;
        CategoryService.deleteCategory(id)
            .then(() => {
                toast.success(`Categoría "${name}" eliminada.`);
                loadAll();
            })
            .catch(err => {
                toast.error(err.response?.data || `No se pudo eliminar "${name}".`);
            })
            .finally(() => setCategoryToDelete(null));
    };

    const productosDeCategoria = (categoryName) =>
        products.filter(p => p.category === categoryName);

    return (
        <div className="container mt-4">
            <h2>Categorías</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Alta de categorías nuevas */}
            <div className="card mb-4">
                <div className="card-header">Nueva categoría</div>
                <div className="card-body">
                    <form className="row g-2 align-items-end" onSubmit={handleCrearCategoria}>
                        <div className="col-md-6">
                            <label className="form-label">Nombre</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Ej: Congelados"
                                value={nombre}
                                onChange={e => setNombre(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Prefijo del código</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Ej: CO"
                                maxLength={4}
                                value={prefijo}
                                onChange={e => setPrefijo(e.target.value.toUpperCase())}
                            />
                        </div>
                        <div className="col-md-3">
                            <button type="submit" className="btn btn-primary w-100" disabled={guardando}>
                                {guardando ? 'Guardando...' : '+ Agregar categoría'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Desglose por categoría: productos y su stock */}
            <div className="row">
                {categories.length > 0 ? (
                    categories.map(cat => {
                        const productosCat = productosDeCategoria(cat.name);
                        const stockTotal = productosCat.reduce((acc, p) => acc + (p.stock || 0), 0);
                        return (
                            <div key={cat.id} className="col-md-6 mb-4">
                                <div className="card h-100">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <span>
                                            <strong>{cat.name}</strong>{' '}
                                            <span className="badge bg-secondary ms-1">{cat.prefix}</span>
                                        </span>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => setCategoryToDelete(cat)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                    <ul className="list-group list-group-flush">
                                        {productosCat.length > 0 ? (
                                            productosCat.map(p => (
                                                <li key={p.id} className="list-group-item d-flex justify-content-between">
                                                    <span>{p.code ? `${p.code} — ` : ''}{p.name}</span>
                                                    <strong>{p.stock} unid.</strong>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="list-group-item text-muted">Sin productos todavía.</li>
                                        )}
                                    </ul>
                                    <div className="card-footer text-muted d-flex justify-content-between">
                                        <span>{productosCat.length} producto(s)</span>
                                        <span>{stockTotal} unidades en stock</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-muted">Aún no hay categorías.</p>
                )}
            </div>

            <ConfirmModal
                show={!!categoryToDelete}
                title="Eliminar categoría"
                message={`¿Estás seguro de eliminar "${categoryToDelete?.name}"? Solo se puede eliminar si no tiene productos asociados.`}
                confirmLabel="Eliminar"
                variant="danger"
                onConfirm={confirmDelete}
                onCancel={() => setCategoryToDelete(null)}
            />
        </div>
    );
};

export default AdminCategoriesPage;
