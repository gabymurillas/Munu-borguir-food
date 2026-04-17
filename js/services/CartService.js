/**
 * Servicio del Carrito de Compra (State Manager)
 */
class CartService {
    constructor() {
        this.items = [];
        this.onCartUpdated = null; 
    }

    agregarProducto(nombre, precioTotalUSD, cantidad = 1) {
        const itemExistente = this.items.find(i => i.nombre === nombre);
        if (itemExistente) {
            itemExistente.cantidad += cantidad;
        } else {
            this.items.push({ nombre, precioTotalUSD, cantidad });
        }
        
        if (this.onCartUpdated) this.onCartUpdated(this.items);
    }

    removerProducto(nombre) {
        this.items = this.items.filter(i => i.nombre !== nombre);
        if (this.onCartUpdated) this.onCartUpdated(this.items);
    }

    modificarCantidad(nombre, delta) {
        const itemExistente = this.items.find(i => i.nombre === nombre);
        if (itemExistente) {
            itemExistente.cantidad += delta;
            if (itemExistente.cantidad <= 0) {
                this.removerProducto(nombre);
            }
        }
        if (this.onCartUpdated) this.onCartUpdated(this.items);
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.precioTotalUSD * item.cantidad), 0);
    }

    getItems() {
        return this.items;
    }
    
    limpiarCarrito() {
        this.items = [];
        if (this.onCartUpdated) this.onCartUpdated(this.items);
    }
}
