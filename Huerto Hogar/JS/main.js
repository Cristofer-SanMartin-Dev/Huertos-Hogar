document.addEventListener('DOMContentLoaded', () => {
    // --- Autenticación Simulada ---
    const loginLink = document.getElementById('login-link');
    const profileLink = document.getElementById('profile-link');
    const logoutBtn = document.getElementById('logout-btn');

    const checkLoginStatus = () => {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            loginLink.classList.add('hidden');
            profileLink.classList.remove('hidden');
        } else {
            loginLink.classList.remove('hidden');
            profileLink.classList.add('hidden');
            if (window.location.pathname.includes('perfil.html')) {
                window.location.href = 'login.html';
            }
        }
    };

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

    const renderStars = (rating) => {
        let stars = '';
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        for (let i = 0; i < fullStars; i++) {
            stars += '★';
        }
        if (halfStar && fullStars < 5) {
            stars += '½';
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '☆';
        }
        return `<div class="stars">${stars} <span>${rating.toFixed(1)}</span></div>`;
    };

    // FUNCIÓN MODIFICADA PARA MOSTRAR STOCK Y DESHABILITAR BOTÓN
    const renderProducts = (productsToRender, container) => {
        if (!container) return;
        container.innerHTML = '';
        productsToRender.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';

            // Determina si hay stock para cambiar estilos y textos
            const outOfStock = product.stock === 0;
            const stockClass = outOfStock ? 'out-of-stock' : '';
            const buttonDisabled = outOfStock ? 'disabled' : '';
            const buttonText = outOfStock ? 'Agotado' : 'Agregar';

            productCard.innerHTML = `
                <div class="product-image" style="background-image: url('${product.imageUrl}');"></div>
                <div class="product-info">
                    <h4>${product.name}</h4>
                    ${renderStars(product.rating)}
                    <p class="price">$${product.price.toLocaleString('es-CL')}</p>
                    <p class="product-stock ${stockClass}">Disponibles: ${product.stock}</p>
                    <p>${product.description}</p>
                    <div class="product-buttons">
                        <button class="btn add-to-cart-btn" data-id="${product.id}" ${buttonDisabled}>${buttonText}</button>
                        <button class="btn-secondary view-reviews-btn" data-id="${product.id}">Reseñas</button>
                    </div>
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

    if (productGrid) {
        renderProducts(products, productGrid);
        searchBar.addEventListener('input', filterAndRender);
        categoryFilter.addEventListener('change', filterAndRender);
    }
    
    if (featuredGrid) {
        renderProducts(products.slice(0, 3), featuredGrid);
    }

    // --- Lógica para el Modal de Reseñas ---
    const modal = document.getElementById('reviews-modal');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const modalProductName = document.getElementById('modal-product-name');
    const modalReviewsList = document.getElementById('modal-reviews-list');
    const submitReviewBtn = document.getElementById('submit-review-btn');
    const reviewTextarea = document.getElementById('review-textarea');
    let currentProductId = null;

    const openReviewsModal = (productId) => {
        currentProductId = productId;
        const product = products.find(p => p.id === productId);
        modalProductName.textContent = product.name;
        modalReviewsList.innerHTML = '';
        if (product.reviews.length > 0) {
            product.reviews.forEach(review => {
                const reviewElement = document.createElement('div');
                reviewElement.className = 'review';
                reviewElement.innerHTML = `
                    <p><strong>${review.user}</strong> <span class="review-date">${review.date}</span></p>
                    <p>${review.comment}</p>
                `;
                modalReviewsList.appendChild(reviewElement);
            });
        } else {
            modalReviewsList.innerHTML = '<p>Este producto aún no tiene reseñas. ¡Sé el primero!</p>';
        }
        modal.classList.remove('hidden');
    };

    const closeReviewsModal = () => {
        if (modal) {
            modal.classList.add('hidden');
            reviewTextarea.value = '';
        }
    };

    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('view-reviews-btn')) {
            const productId = e.target.getAttribute('data-id');
            openReviewsModal(productId);
        }
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeReviewsModal);
    }

    if (submitReviewBtn) {
        submitReviewBtn.addEventListener('click', () => {
            const comment = reviewTextarea.value.trim();
            if (comment) {
                const newReview = { user: 'Tú (simulado)', date: new Date().toLocaleDateString('es-CL'), comment: comment };
                const reviewElement = document.createElement('div');
                reviewElement.className = 'review';
                reviewElement.innerHTML = `
                    <p><strong>${newReview.user}</strong> <span class="review-date">${newReview.date}</span></p>
                    <p>${newReview.comment}</p>
                `;
                if (modalReviewsList.querySelector('p')?.textContent.includes('aún no tiene reseñas')) {
                    modalReviewsList.innerHTML = '';
                }
                modalReviewsList.appendChild(reviewElement);
                reviewTextarea.value = '';
            }
        });
    }

    checkLoginStatus();
});