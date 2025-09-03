document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    const updateCartCount = () => {
        cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
    };

    const saveCart = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    const renderCartItems = () => {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
            return;
        }

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-image" style="background-image: url('${item.imageUrl}');"></div>
                    <div>
                        <h4>${item.name}</h4>
                        <p>$${item.price.toLocaleString('es-CL')}</p>
                    </div>
                </div>
                <div class="cart-item-controls">
                    <button class="remove-from-cart-btn" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="add-to-cart-btn" data-id="${item.id}">+</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    };

    const updateCartTotal = () => {
        if (!cartTotal) return;
        const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        cartTotal.textContent = `$${total.toLocaleString('es-CL')}`;
    };

    const addToCart = (productId) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const cartItem = cart.find(item => item.id === productId);

        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        saveCart();
        updateCartCount();
        renderCartItems();
        updateCartTotal();
    };

    const removeFromCart = (productId) => {
        const cartItemIndex = cart.findIndex(item => item.id === productId);
        if (cartItemIndex === -1) return;

        cart[cartItemIndex].quantity--;

        if (cart[cartItemIndex].quantity === 0) {
            cart.splice(cartItemIndex, 1);
        }

        saveCart();
        updateCartCount();
        renderCartItems();
        updateCartTotal();
    };

    // Event Delegation para los botones del carrito
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = e.target.getAttribute('data-id');
            addToCart(productId);
        }
        if (e.target.classList.contains('remove-from-cart-btn')) {
            const productId = e.target.getAttribute('data-id');
            removeFromCart(productId);
        }
    });

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Tu carrito está vacío.');
                return;
            }
            alert('¡Gracias por tu compra! Tu pedido está siendo procesado y recibirás notificaciones.');
            cart = [];
            saveCart();
            updateCartCount();
            renderCartItems();
            updateCartTotal();
        });
    }

    // Inicializar vista del carrito
    updateCartCount();
    renderCartItems();
    updateCartTotal();
});