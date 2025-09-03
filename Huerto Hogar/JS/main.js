document.addEventListener('DOMContentLoaded', () => {
    // --- Autenticación Simulada ---
    const loginLink = document.getElementById('login-link');
    const profileLink = document.getElementById('profile-link');
    const logoutBtn = document.getElementById('logout-btn');
    const profileContent = document.getElementById('profile-content');

    const checkLoginStatus = () => {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            loginLink.classList.add('hidden');
            profileLink.classList.remove('hidden');
        } else {
            loginLink.classList.remove('hidden');
            profileLink.classList.add('hidden');
            // Si no está logueado y está en la página de perfil, lo redirige
            if (window.location.pathname.includes('perfil.html')) {
                window.location.href = 'login.html';
            }
        }
    };

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Simulación simple: cualquier dato es válido
            localStorage.setItem('isLoggedIn', 'true');
            window.location.href = 'perfil.html';
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'index.html';
        });
    }

    // --- Renderizado de Productos ---
    const productGrid = document.getElementById('product-grid');
    const featuredGrid = document.getElementById('featured-products-grid');
    const searchBar = document.getElementById('search-bar');
    const categoryFilter = document.getElementById('category-filter');

    const renderProducts = (productsToRender, container) => {
        container.innerHTML = '';
        if (productsToRender.length === 0) {
            container.innerHTML = '<p>No se encontraron productos.</p>';
            return;
        }

        productsToRender.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-image" style="background-image: url('${product.imageUrl}');"></div>
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p class="price">$${product.price.toLocaleString('es-CL')}</p>
                    <p>${product.description}</p>
                    <button class="btn add-to-cart-btn" data-id="${product.id}">Agregar al Carrito</button>
                </div>
            `;
            container.appendChild(productCard);
        });
    };

    const filterAndRender = () => {
        if (!productGrid) return;
        const searchTerm = searchBar.value.toLowerCase();
        const selectedCategory = categoryFilter.value;

        let filteredProducts = products;

        if (selectedCategory !== 'all') {
            filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
        }

        if (searchTerm) {
            filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(searchTerm));
        }

        renderProducts(filteredProducts, productGrid);
    };

    // Renderizar productos en la página de productos
    if (productGrid) {
        renderProducts(products, productGrid);
        searchBar.addEventListener('input', filterAndRender);
        categoryFilter.addEventListener('change', filterAndRender);
    }
    
    // Renderizar productos destacados en la página de inicio (los 3 primeros)
    if (featuredGrid) {
        renderProducts(products.slice(0, 3), featuredGrid);
    }

    checkLoginStatus();
});