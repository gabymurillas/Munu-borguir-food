export class AdminController {
    constructor(dataService, state, view) {
        this.dataService = dataService;
        this.state = state;
        this.view = view;
    }

    async init() {
        // Authenticate
        const password = prompt("Ingresa la contraseña de administrador:");
        if (password !== "borguer123") {
            alert("Acceso denegado");
            window.location.href = "../index.html";
            return;
        }

        try {
            const categories = await this.dataService.getCategories();
            const products = await this.dataService.getProducts();

            this.state.setCategories(categories);
            this.state.setProducts(products);

            this.updateUI();
            this.setupEventListeners();
        } catch (error) {
            this.view.adminContent.innerHTML = `<p style="color:red">Error cargando datos: ${error.message}</p>`;
        }
    }

    updateUI() {
        this.view.updateStats(this.state.getCategories().length, this.state.getProducts().length);
        this.view.renderFilters(this.state.getCategories(), this.state.getActiveCategory());
        this.view.renderProducts(
            this.state.getCategories(),
            this.state.getProducts(),
            this.state.getActiveCategory(),
            this.view.searchInput.value
        );
    }

    setupEventListeners() {
        // Search
        this.view.searchInput.addEventListener('input', () => this.updateUI());

        // Filters delegation
        this.view.filterContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('chip')) {
                const catId = e.target.getAttribute('data-cat-id');
                this.state.setActiveCategory(catId);
                this.updateUI();
            }
        });

        // Products events delegation
        this.view.adminContent.addEventListener('change', (e) => {
            if (e.target.classList.contains('edit-input')) {
                const id = e.target.getAttribute('data-product-id');
                const field = e.target.getAttribute('data-field');
                const value = e.target.value;
                this.handleUpdateProductField(id, field, value);
            } else if (e.target.classList.contains('price-input')) {
                const id = e.target.getAttribute('data-price-id');
                const amount = parseFloat(e.target.value);
                this.handleUpdatePrice(id, amount);
            }
        });

        this.view.adminContent.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const id = e.target.getAttribute('data-delete-id');
                this.handleDeleteProduct(id, e.target);
            }
        });

        // Modals - Provide global functions for inline onclick references in HTML
        window.showAddModal = () => this.view.showAddModal(this.state.getCategories());
        window.hideAddModal = () => this.view.hideAddModal();
        window.showCategoryModal = () => this.view.showCategoryModal();
        window.hideCategoryModal = () => this.view.hideCategoryModal();

        // Add Product Form
        this.view.addProductForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddProduct();
        });

        // Add Category Form
        if (this.view.addCategoryForm) {
            this.view.addCategoryForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddCategory();
            });
        }
    }

    async handleUpdateProductField(id, field, value) {
        this.view.showToast('Guardando...', 'success');
        try {
            await this.dataService.updateProductField(id, field, value);
            this.state.updateProduct(id, field, value);
            this.view.showToast('Guardado');
        } catch (error) {
            this.view.showToast('Error: ' + error.message, 'error');
        }
    }

    async handleUpdatePrice(id, amount) {
        this.view.setPriceWrapperFeedback(id, 'processing');
        try {
            await this.dataService.updatePrice(id, amount);
            this.state.updatePrice(id, amount);
            this.view.setPriceWrapperFeedback(id, 'success');
            this.view.showToast('Precio actualizado');
        } catch (error) {
            this.view.setPriceWrapperFeedback(id, 'error');
            this.view.showToast('Error al actualizar: ' + error.message, 'error');
        }
    }

    async handleDeleteProduct(id, btn) {
        if (!confirm('¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.')) return;

        const originalText = btn.innerHTML;
        btn.innerHTML = '...';
        btn.disabled = true;

        try {
            await this.dataService.deleteProduct(id);
            this.state.removeProduct(id);
            this.view.showToast('Producto eliminado');
            this.updateUI();
        } catch (error) {
            this.view.showToast('Error al eliminar: ' + error.message, 'error');
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }

    async handleAddProduct() {
        const name = document.getElementById('new-name').value;
        const category_id = document.getElementById('new-category').value;
        const description = document.getElementById('new-desc').value;
        const amountElement = document.getElementById('new-price');
        const amount = parseFloat(amountElement.value);

        try {
            const product = await this.dataService.createProduct(name, category_id, description);
            const price = await this.dataService.createPrice(product.id, 'Pedir', amount);

            product.prices = [price];
            this.state.addProduct(product);

            this.view.hideAddModal();
            this.updateUI();
            this.view.showToast('Producto creado con éxito');
        } catch (error) {
            alert('Error al crear producto: ' + error.message);
        }
    }

    async handleAddCategory() {
        const name = document.getElementById('new-cat-name').value;
        const slug = document.getElementById('new-cat-slug').value;

        try {
            const cat = await this.dataService.createCategory(name, slug);
            this.state.addCategory(cat);

            this.view.hideCategoryModal();
            this.updateUI();
            this.view.showToast('Categoría creada con éxito');
        } catch (error) {
            alert('Error al crear categoría: ' + error.message);
        }
    }
}
