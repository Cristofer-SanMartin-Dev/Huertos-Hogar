import React from 'react';
import { Link } from 'react-router-dom';

// TUTOR: Datos simulados para las categorías. En un futuro, vendrían de la API.
const categorias = [
    { nombre: 'Frutas Frescas', img: '/assets/manzana.png' },
    { nombre: 'Verduras Orgánicas', img: '/assets/zanahoria.png' },
    { nombre: 'Productos Orgánicos', img: '/assets/miel.png' },
    { nombre: 'Productos Lácteos', img: '/assets/leche.png' }
];

const CategoriasPage = () => {
    return (
        <div className="container py-5">
            <h2 className="text-center mb-4 section-title">Categorías</h2>
            
            {/* Basado en la Figura 4  */}
            <div className="row row-cols-1 row-cols-md-4 g-4">
                {categorias.map(categoria => (
                    <div key={categoria.nombre} className="col">
                        <Link to="/productos" className="text-decoration-none">
                            <div className="card h-100 shadow-sm text-center">
                                <img src={categoria.img} className="card-img-top p-4" alt={categoria.nombre} style={{height: '200px', objectFit: 'contain'}} />
                                <div className="card-body">
                                    <h5 className="product-title">{categoria.nombre}</h5>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoriasPage;