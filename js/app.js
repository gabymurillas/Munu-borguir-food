/**
 * Aplicación principal
 */
class App {
    static start() {
        const currencyService = new CurrencyService();
        this.cartService = new CartService();
        const uiController = new UIController(currencyService, this.cartService);
        uiController.init();
        currencyService.obtenerTasa();
        
        // Funciones conectadas de manera global para que el HTML renderizado tenga acceso
        window.agregarAlCarrito = (nombre, precio) => {
            App.cartService.agregarProducto(nombre, precio);
            
            // Efecto visual simple
            const cartBtn = document.getElementById('btn-cart');
            cartBtn.style.transform = 'scale(1.2)';
            setTimeout(() => cartBtn.style.transform = 'scale(1)', 200);
        };
        
        window.modificarItemCarrito = (nombre, delta) => {
            App.cartService.modificarCantidad(nombre, delta);
        };
    }
}

// Inicializar la app
document.addEventListener('DOMContentLoaded', () => {
    App.start();
});
