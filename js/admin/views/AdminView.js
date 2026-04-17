export class AdminView {
    constructor() {
        this.adminContent = document.getElementById('admin-content');
        this.searchInput = document.getElementById('admin-search');
        this.statCategories = document.getElementById('stat-categories');
        this.statProducts = document.getElementById('stat-products');
        this.filterContainer = document.getElementById('category-filters');
        this.addModal = document.getElementById('add-modal');
        this.newCategorySelect = document.getElementById('new-category');
        this.addProductForm = document.getElementById('add-product-form');
    }

    updateStats(categoriesCount, productsCount) {
        if (this.statCategories) this.statCategories.textContent = categoriesCount;
        if (this.statProducts) this.statProducts.textContent = productsCount;
    }

    renderFilters(categories, activeCategoryId) {
        let html = `<button class="chip ${activeCategoryId === '' ? 'active' : ''}" data-cat-id="">Todos</button>`;
        html += categories.map(c =>
            `<button class="chip ${activeCategoryId === c.id ? 'active' : ''}" data-cat-id="${c.id}">${c.name}</button>`
        ).join('');
        this.filterContainer.innerHTML = html;
    }

    renderProducts(categories, products, activeCategoryId, filterText) {
        this.adminContent.innerHTML = '';
        const search = filterText.toLowerCase();

        categories.forEach(category => {
            if (activeCategoryId && category.id !== activeCategoryId) return;

            const catProducts = products.filter(p =>
                p.category_id === category.id &&
                (p.name.toLowerCase().includes(search) || (p.description && p.description.toLowerCase().includes(search)))
            );

            if (catProducts.length === 0) return;

            const catSection = document.createElement('div');
            catSection.className = 'category-group';
            catSection.innerHTML = `<h2 class="category-header">${category.name}</h2>`;

            const grid = document.createElement('div');
            grid.className = 'product-grid';

            catProducts.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';

                let pricesHtml = '';
                product.prices.forEach(price => {
                    let displayLabel = price.label;
                    if (category.slug === 'perros' && price.label.toLowerCase() === '2x') {
                        displayLabel = 'Un combo';
                    }
                    pricesHtml += `
                        <div class="price-item">
                            <label>${displayLabel}</label>
                            <div class="price-input-wrapper" id="price-wrapper-${price.id}">
                                <span>$</span>
                                <input type="number" step="0.01" class="price-input" 
                                    value="${price.amount}" id="price-${price.id}" data-price-id="${price.id}">
                            </div>
                        </div>`;
                });

                card.innerHTML = `
                    <div class="product-header">
                        <div class="product-info">
                            <input class="edit-input name-edit" value="${product.name}" data-product-id="${product.id}" data-field="name">
                            <textarea class="edit-input desc-edit" data-product-id="${product.id}" data-field="description">${product.description || ''}</textarea>
                        </div>
                        <button class="delete-btn" data-delete-id="${product.id}" title="Eliminar">🗑️</button>
                    </div>
                    <div class="price-grid">
                        ${pricesHtml}
                    </div>
                `;
                grid.appendChild(card);
            });

            catSection.appendChild(grid);
            this.adminContent.appendChild(catSection);
        });
    }

    showAddModal(categories) {
        this.addModal.style.display = 'block';
        this.newCategorySelect.innerHTML = categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }

    hideAddModal() {
        this.addModal.style.display = 'none';
        this.addProductForm.reset();
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerText = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    setPriceWrapperFeedback(priceId, status) {
        const wrapper = document.getElementById(`price-wrapper-${priceId}`);
        if (wrapper) {
            if (status === 'processing') {
                wrapper.style.borderColor = '#DBA400';
            } else if (status === 'success') {
                wrapper.style.borderColor = '#2aa354';
                setTimeout(() => wrapper.style.borderColor = 'rgba(255,255,255,0.1)', 2000);
            }
        }
    }
}
