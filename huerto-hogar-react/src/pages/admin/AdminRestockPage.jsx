import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProductService from '../../services/productService.js';

// Reponer stock suma una cantidad al stock actual en vez de reemplazarlo:
// así el admin no tiene que calcular ni escribir el total a mano, y no hay
// riesgo de pisar por accidente el stock real (ej. ya descontado por pedidos
// hechos mientras tanto).
const AdminRestockPage = () => {
    const [products, setProducts] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [seleccionado, setSeleccionado] = useState(null);
    const [cantidad, setCantidad] = useState('');
    const [guardando, setGuardando] = useState(false);

    const loadProducts = () => {
        ProductService.getAllProducts()
            .then(response => setProducts(response.data))
            .catch(err => console.error('Error cargando productos', err));
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const termino = busqueda.trim().toLowerCase();
    const resultados = termino
        ? products.filter(p =>
            (p.code && p.code.toLowerCase().includes(termino)) ||
            p.name.toLowerCase().includes(termino))
        : products;

    const handleSeleccionar = (product) => {
        setSeleccionado(product);
        setCantidad('');
    };

    const handleReponer = (e) => {
        e.preventDefault();
        const cantidadNum = Number(cantidad);
        if (!cantidadNum || cantidadNum <= 0) {
            toast.error('Ingresa una cantidad mayor a 0.');
            return;
        }
        setGuardando(true);
        ProductService.addStock(seleccionado.id, cantidadNum)
            .then((response) => {
                toast.success(`Stock de "${seleccionado.name}" actualizado: ${response.data.stock} unidades.`);
                setCantidad('');
                setSeleccionado(null);
                loadProducts();
            })
            .catch(err => {
                toast.error(err.response?.data || 'No se pudo reponer el stock.');
            })
            .finally(() => setGuardando(false));
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Reponer Stock</h2>
                <Link to="/admin/productos" className="btn btn-secondary">Volver a Productos</Link>
            </div>

            <div className="mb-3">
                <label className="form-label">Buscar por código o nombre</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Ej: FR001 o Manzana"
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    autoFocus
                />
            </div>

            <div className="table-responsive mb-4">
                <table className="table table-striped align-middle">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Stock actual</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {resultados.length > 0 ? (
                            resultados.map(product => (
                                <tr key={product.id} className={seleccionado?.id === product.id ? 'table-success' : ''}>
                                    <td>{product.code || '—'}</td>
                                    <td>{product.name}</td>
                                    <td>{product.category}</td>
                                    <td>{product.stock}</td>
                                    <td>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => handleSeleccionar(product)}
                                        >
                                            Reponer
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={5} className="text-muted">No se encontraron productos.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {seleccionado && (
                <div className="card">
                    <div className="card-header">
                        Reponer stock de "{seleccionado.name}" ({seleccionado.code || 'sin código'})
                    </div>
                    <div className="card-body">
                        <form className="row g-2 align-items-end" onSubmit={handleReponer}>
                            <div className="col-md-4">
                                <label className="form-label">Stock actual</label>
                                <input type="text" className="form-control" value={seleccionado.stock} disabled />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Cantidad a agregar</label>
                                <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    className="form-control"
                                    value={cantidad}
                                    onChange={e => setCantidad(e.target.value)}
                                    autoFocus
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <button type="submit" className="btn btn-success w-100" disabled={guardando}>
                                    {guardando ? 'Guardando...' : 'Confirmar reposición'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRestockPage;
