import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductService from '../../services/productService';

const ProductForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null); // Para el archivo nuevo
    const [preview, setPreview] = useState(null); // Para previsualizar

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
        const productData = { name, description, price, stock, category };

        if (id) {
            ProductService.updateProduct(id, productData, image)
                .then(() => navigate('/admin'))
                .catch(err => alert('Error al actualizar'));
        } else {
            ProductService.createProduct(productData, image)
                .then(() => navigate('/admin'))
                .catch(err => alert('Error al crear'));
        }
    };

    return (
        <div className="container mt-4">
            <h2>{id ? 'Editar Producto' : 'Nuevo Producto'}</h2>
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
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Precio</label>
                        <input type="number" className="form-control" value={price} onChange={e => setPrice(e.target.value)} required />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Stock</label>
                        <input type="number" className="form-control" value={stock} onChange={e => setStock(e.target.value)} required />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Categoría</label>
                        <select className="form-select" value={category} onChange={e => setCategory(e.target.value)} required>
                            <option value="">Seleccione...</option>
                            <option value="Frutas">Frutas</option>
                            <option value="Verduras">Verduras</option>
                            <option value="Lácteos">Lácteos</option>
                            <option value="Otros">Otros</option>
                        </select>
                    </div>
                </div>
                
                {/* Input de Imagen */}
                <div className="mb-3">
                    <label className="form-label">Imagen del Producto</label>
                    <input type="file" className="form-control" onChange={handleFileChange} accept="image/*" />
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