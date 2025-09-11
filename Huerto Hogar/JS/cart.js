document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountSpan = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalSpan = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    const updateCartCount = () => {
        if (cartCountSpan) {
            cartCountSpan.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
        }
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
            const cartItemEl = document.createElement('div');
            cartItemEl.className = 'cart-item';
            cartItemEl.innerHTML = `
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
                    <button class="add-to-cart-btn-small" data-id="${item.id}">+</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemEl);
        });
    };
    
    const updateCartTotal = () => {
        if (cartTotalSpan) {
            const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            cartTotalSpan.textContent = `$${total.toLocaleString('es-CL')}`;
        }
    };

    // FUNCIÓN MODIFICADA PARA VALIDAR EL STOCK
    const addToCart = (productId) => {
        const productData = products.find(p => p.id === productId); // Busca el producto en la "base de datos"
        if (!productData) return; // Si el producto no existe, no hace nada

        const itemInCart = cart.find(item => item.id === productId);
        const quantityInCart = itemInCart ? itemInCart.quantity : 0;

        // Comprueba si la cantidad en el carrito es menor que el stock disponible
        if (quantityInCart < productData.stock) {
            if (itemInCart) {
                itemInCart.quantity++;
            } else {
                cart.push({ ...productData, quantity: 1 });
            }
            saveCart();
            updateCartCount();
            renderCartItems();
            updateCartTotal();
        } else {
            // Si no hay más stock, muestra una alerta
            alert('No puedes agregar más de este producto. ¡Stock máximo alcanzado!');
        }
    };

    const removeFromCart = (productId) => {
        const productInCartIndex = cart.findIndex(item => item.id === productId);
        if (productInCartIndex > -1) {
            if (cart[productInCartIndex].quantity > 1) {
                cart[productInCartIndex].quantity--;
            } else {
                cart.splice(productInCartIndex, 1);
            }
        }
        saveCart();
        updateCartCount();
        renderCartItems();
        updateCartTotal();
    };

    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            addToCart(e.target.dataset.id);
        }
        if (e.target.classList.contains('add-to-cart-btn-small')) {
            addToCart(e.target.dataset.id);
        }
        if (e.target.classList.contains('remove-from-cart-btn')) {
            removeFromCart(e.target.dataset.id);
        }
    });

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Tu carrito está vacío.');
                return;
            }
            alert('¡Gracias por tu compra! Tu pedido está siendo procesado.');
            cart = [];
            saveCart();
            updateCartCount();
            renderCartItems();
            updateCartTotal();
        });
    }

    updateCartCount();
    renderCartItems();
    updateCartTotal();
});