// src/pages/CartPage.jsx
import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import { Link } from 'react-router-dom';
import ImpactoAmbiental from '../components/ImpactoAmbiental.jsx';

const CartPage = () => {
    // TUTOR: 1. Ya no necesitamos 'clearCart' aquí. Lo usará la página de Checkout.
    const { cart, removeFromCart, incrementQuantity, decrementQuantity } = useCart();
    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    if (cart.length === 0) {
        return (
            <div className="container text-center py-5">
                <h2 className="section-title">Tu Carrito está Vacío</h2>
                <p className="lead text-muted">Parece que aún no has agregado productos.</p>
                <Link to="/productos" className="btn btn-primary mt-3">
                    Ver Catálogo de Productos
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <h2 className="mb-4 section-title">Tu Carrito de Compras</h2>
            <div className="row">
                {/* Columna de la lista de productos (sin cambios) */}
                <div className="col-lg-8">
                    {cart.map(item => (
                        <div key={item.id} className="card mb-3">
                            {/* ... (código del item del carrito) ... */}
                        </div>
                    ))}
                </div>

                {/* Columna del Resumen del Pedido */}
                <div className="col-lg-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title product-title">Resumen del Pedido</h5>
                            <ul className="list-group list-group-flush">
                                {/* ... (total y subtotal) ... */}
                            </ul>
                            <ImpactoAmbiental cart={cart} />
                            
                            {/* TUTOR: 2. Cambiamos el botón por un <Link> a la página /checkout */}
                            <div className="d-grid gap-2 mt-3">
                                <Link to="/checkout" className="btn btn-success">
                                    Finalizar Compra
                                </Link>
                                {/* TUTOR: 3. El botón 'Vaciar Carrito' ahora debe usar clearCart */}
                                <button onClick={useCart().clearCart} className="btn btn-outline-danger">
                                    Vaciar Carrito
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;