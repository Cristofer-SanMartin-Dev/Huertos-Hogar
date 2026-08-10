import React from 'react';
import { useNavigate } from 'react-router-dom';

// TUTOR: Datos simulados para las categorías. En un futuro, vendrían de la API.
const categorias = [
    {
        nombre: 'Frutas Frescas',
        img: '/assets/manzana.png',
        descripcion: 'Nuestra selección de frutas frescas ofrece una experiencia directa del campo a tu hogar. Estas frutas se cultivan y cosechan en el punto óptimo de madurez para asegurar su sabor y frescura. Disfruta de una variedad de frutas de temporada que aportan vitaminas y nutrientes esenciales a tu dieta diaria. Perfectas para consumir solas, en ensaladas o como ingrediente principal en postres y smoothies.'
    },
    {
        nombre: 'Verduras Orgánicas',
        img: '/assets/zanahoria.png',
        descripcion: 'Descubre nuestra gama de verduras orgánicas, cultivadas sin el uso de pesticidas ni químicos, garantizando un sabor auténtico y natural. Cada verdura es seleccionada por su calidad y valor nutricional, ofreciendo una excelente fuente de vitaminas, minerales y fibra. Ideales para ensaladas, guisos y platos saludables, nuestras verduras orgánicas promueven una alimentación consciente y sostenible.'
    },
    {
        nombre: 'Productos Orgánicos',
        img: '/assets/miel.png',
        descripcion: 'Nuestros productos orgánicos están elaborados con ingredientes naturales y procesados de manera responsable para mantener sus beneficios saludables. Desde aceites y miel hasta granos y semillas, ofrecemos una selección que apoya un estilo de vida saludable y respetuoso con el medio ambiente. Estos productos son perfectos para quienes buscan opciones alimenticias que aporten bienestar sin comprometer el sabor ni la calidad.'
    },
    {
        nombre: 'Productos Lácteos',
        img: '/assets/leche.png',
        descripcion: 'Los productos lácteos de HuertoHogar provienen de granjas locales que se dedican a la producción responsable y de calidad. Ofrecemos una gama de leches, yogures y otros derivados que conservan su frescura y sabor auténtico. Ricos en calcio y nutrientes esenciales, nuestros lácteos son perfectos para complementar una dieta equilibrada, proporcionando el mejor sabor y nutrición para toda la familia.'
    }
];

const CategoriasPage = () => {
    const navigate = useNavigate();

    const irAProductos = (nombreCategoria) => {
        navigate(`/productos?categoria=${encodeURIComponent(nombreCategoria)}`);
    };

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4 section-title">Categorías</h2>

            {/* Basado en la Figura 4  */}
            <div className="row row-cols-1 row-cols-md-4 g-4">
                {categorias.map(categoria => (
                    <div key={categoria.nombre} className="col">
                        <div className="flip-card">
                            <div className="flip-card-inner">
                                <div className="flip-card-front card h-100 shadow-sm text-center">
                                    <img src={categoria.img} className="card-img-top p-4" alt={categoria.nombre} style={{height: '200px', objectFit: 'contain'}} />
                                    <div className="card-body">
                                        <h5 className="product-title">{categoria.nombre}</h5>
                                    </div>
                                </div>
                                <div className="flip-card-back shadow-sm">
                                    <h5 className="mb-3">{categoria.nombre}</h5>
                                    <p>{categoria.descripcion}</p>
                                    <button
                                        className="btn btn-light btn-sm mt-2"
                                        onClick={() => irAProductos(categoria.nombre)}>
                                        Ver productos
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoriasPage;
