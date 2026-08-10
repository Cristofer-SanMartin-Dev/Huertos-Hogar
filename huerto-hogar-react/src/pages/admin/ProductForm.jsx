import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductService from '../../services/productService';

// No todo se vende por unidad: algunos productos se venden por peso o envase.
const UNIDADES_PREDEFINIDAS = ['unidad', 'kilo', 'gramo (100g)', 'bolsa 500g', 'frasco 500g', 'litro', 'paquete', 'docena'];

const ProductForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [category, setCategory] = useState('');
    const [origin, setOrigin] = useState('');
    const [sustainability, setSustainability] = useState('');
    const [recipes, setRecipes] = useState('');
    const [descuento, setDescuento] = useState('');
    const [unidadMedida, setUnidadMedida] = useState('unidad');
    const [unidadPersonalizada, setUnidadPersonalizada] = useState('');
    const [image, setImage] = useState(null); // Para el archivo nuevo
    const [preview, setPreview] = useState(null); // Para previsualizar
    const [formError, setFormError] = useState('');

    const navigate = useNavigate();
    const { id } = useParams(); // Si hay ID, estamos editando

    useEffect(() => {
        if (id) {
            ProductService.getProductById(id)
                .then(response => {
                    const p = response.data;
                    setName(p.name);
                    setDescription(p.description);
                    setPrice(p.price);
                    setStock(p.stock);
                    setCategory(p.category);
                    setOrigin(p.origin || '');
                    setSustainability(p.sustainability || '');
                    setRecipes(p.recipes || '');
                    setDescuento(p.descuento ?? '');
                    const unidad = p.unidadMedida || 'unidad';
                    if (UNIDADES_PREDEFINIDAS.includes(unidad)) {
                        setUnidadMedida(unidad);
                    } else {
                        setUnidadMedida('otro');
                        setUnidadPersonalizada(unidad);
                    }
                    // Mostrar imagen actual si existe
                    if (p.imageName) {
                        setPreview(ProductService.getImageUrl(p.imageName));
                    }
                })
                .catch(err => console.error(err));
        }
    }, [id]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file)); // Previsualización local
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError('');

        // La imagen es obligatoria al crear (el backend la exige). Al editar es
        // opcional: si no se elige una nueva, se conserva la actual.
        if (!id && !image) {
            setFormError('Debes seleccionar una imagen para el producto.');
            return;
        }

        const unidadFinal = unidadMedida === 'otro' ? unidadPersonalizada.trim() : unidadMedida;
        if (unidadMedida === 'otro' && !unidadFinal) {
            setFormError('Escribe la unidad de medida personalizada, o elige una de la lista.');
            return;
        }

        const productData = { name, description, price, stock, category, origin, sustainability, recipes, descuento, unidadMedida: unidadFinal };

        if (id) {
            ProductService.updateProduct(id, productData, image)
                .then(() => navigate('/admin'))
                .catch(err => {
                    console.error('Error al actualizar el producto:', err);
                    setFormError(err.response?.data || 'Error al actualizar el producto.');
                });
        } else {
            ProductService.createProduct(productData, image)
                .then(() => navigate('/admin'))
                .catch(err => {
                    console.error('Error al crear el producto:', err);
                    setFormError(err.response?.data || 'Error al crear el producto.');
                });
        }
    };

    return (
        <div className="container mt-4">
            <h2>{id ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            {formError && <div className="alert alert-danger">{formError}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} required />
                </div>
                <div className="row">
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Precio</label>
                        <input type="number" min="0" step="1" className="form-control" value={price} onChange={e => setPrice(e.target.value)} required />
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Se vende por</label>
                        <select className="form-select" value={unidadMedida} onChange={e => setUnidadMedida(e.target.value)} required>
                            {UNIDADES_PREDEFINIDAS.map(u => (
                                <option key={u} value={u}>{u}</option>
                            ))}
                            <option value="otro">Otro (especificar)...</option>
                        </select>
                        {unidadMedida === 'otro' && (
                            <input
                                type="text"
                                className="form-control mt-2"
                                placeholder="Ej: caja 12 unidades"
                                value={unidadPersonalizada}
                                onChange={e => setUnidadPersonalizada(e.target.value)}
                            />
                        )}
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Stock</label>
                        <input type="number" min="0" step="1" className="form-control" value={stock} onChange={e => setStock(e.target.value)} required />
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Categoría</label>
                        <select className="form-select" value={category} onChange={e => setCategory(e.target.value)} required>
                            <option value="">Seleccione...</option>
                            <option value="Frutas Frescas">Frutas Frescas</option>
                            <option value="Verduras Orgánicas">Verduras Orgánicas</option>
                            <option value="Productos Orgánicos">Productos Orgánicos</option>
                            <option value="Productos Lácteos">Productos Lácteos</option>
                        </select>
                    </div>
                </div>

                {/* Información adicional (opcional) */}
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Origen (opcional)</label>
                        <input type="text" className="form-control" placeholder="Ej: Valle del Maule" value={origin} onChange={e => setOrigin(e.target.value)} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">% Descuento (opcional)</label>
                        <input type="number" min="0" max="100" step="1" className="form-control" placeholder="Ej: 15" value={descuento} onChange={e => setDescuento(e.target.value)} />
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Prácticas Sostenibles (opcional)</label>
                    <textarea className="form-control" rows="2" placeholder="Ej: Cultivo sin pesticidas, certificación orgánica" value={sustainability} onChange={e => setSustainability(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Ideas de Recetas (opcional)</label>
                    <input type="text" className="form-control" placeholder="Ej: Ensalada fresca, jugo natural, tarta" value={recipes} onChange={e => setRecipes(e.target.value)} />
                    <div className="form-text">Sepáralas con comas.</div>
                </div>

                {/* Input de Imagen */}
                <div className="mb-3">
                    <label className="form-label">Imagen del Producto {!id && <span className="text-danger">*</span>}</label>
                    <input type="file" className="form-control" onChange={handleFileChange} accept="image/*" />
                    {!id && <div className="form-text">Obligatoria al crear un producto nuevo.</div>}
                    {preview && (
                        <div className="mt-2">
                            <img src={preview} alt="Vista previa" style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
                        </div>
                    )}
                </div>

                <button type="submit" className="btn btn-success">Guardar</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/admin')}>Cancelar</button>
            </form>
        </div>
    );
};

export default ProductForm;