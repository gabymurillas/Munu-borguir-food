export class AdminState {
    constructor() {
        this.categories = [];
        this.products = [];
        this.activeCategoryId = '';
    }

    setCategories(categories) {
        this.categories = categories;
    }

    setProducts(products) {
        this.products = products;
    }

    updateProduct(id, field, value) {
        const prod = this.products.find(p => p.id === id);
        if (prod) {
            prod[field] = value;
        }
    }

    updatePrice(priceId, newAmount) {
        for (const product of this.products) {
            const price = product.prices.find(p => p.id === priceId);
            if (price) {
                price.amount = newAmount;
                break;
            }
        }
    }

    removeProduct(id) {
        this.products = this.products.filter(p => p.id !== id);
    }

    addProduct(product) {
        this.products.push(product);
    }

    setActiveCategory(id) {
        this.activeCategoryId = id;
    }

    getActiveCategory() {
        return this.activeCategoryId;
    }

    getCategories() {
        return this.categories;
    }

    getProducts() {
        return this.products;
    }
}
