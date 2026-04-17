/**
 * Controlador de la Interfaz (UI)
 */
class UIController {
    constructor(currencyService, cartService) {
        this.currency = currencyService;
        this.cart = cartService;
        this.currency.onTasaObtenida = this.actualizarDOMTasa.bind(this);
        this.cart.onCartUpdated = this.actualizarCarritoUI.bind(this);
    }

    init() {
        this.configurarBotonesTabs();
        this.configurarBotonMoneda();
        this.configurarCarritoBtn();
        this.renderizarMenu();
        // Carga inicial del estado base
        this.actualizarCarritoUI(this.cart.getItems());
    }

    actualizarDOMTasa(tasa) {
        const elemento = document.getElementById('precio-bcv');
        if (tasa) {
            elemento.innerText = `Bs. ${tasa.toFixed(2)}`;
        } else {
            elemento.innerText = 'No disponible';
        }
        // Forzar update en modal de total carrito si hay BCV nuevo
        if (this.cart) this.actualizarCarritoUI(this.cart.getItems());
    }

    configurarCarritoBtn() {
        const btnCart = document.getElementById('btn-cart');
        const modalCart = document.getElementById('cart-modal');
        const closeModal = document.getElementById('close-cart');
        const checkoutBtn = document.getElementById('btn-checkout');

        btnCart.addEventListener('click', () => {
            modalCart.classList.add('show');
        });

        closeModal.addEventListener('click', () => {
            modalCart.classList.remove('show');
        });

        window.addEventListener('click', (event) => {
            if (event.target == modalCart) {
                modalCart.classList.remove('show');
            }
        });
        
        checkoutBtn.addEventListener('click', () => {
            WhatsAppService.enviarCarrito(this.cart.getItems(), this.cart.getTotal());
        });
    }

    actualizarCarritoUI(items) {
        const totalItemsCount = items.reduce((acc, curr) => acc + curr.cantidad, 0);
        document.getElementById('cart-badge').innerText = totalItemsCount;

        const container = document.getElementById('cart-items-container');
        container.innerHTML = '';
        
        if (items.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #bbb; padding: 30px 0;">🛒 Tu carrito está vacío.</p>';
            document.getElementById('btn-checkout').style.display = 'none';
        } else {
            document.getElementById('btn-checkout').style.display = 'block';
            items.forEach(item => {
                container.innerHTML += `
                    <div class="cart-item">
                        <div class="cart-item-details">
                            <h4>${item.nombre}</h4>
                            <span class="cart-item-price">$${(item.precioTotalUSD * item.cantidad).toFixed(2)}</span>
                        </div>
                        <div class="cart-item-actions">
                            <button class="qty-btn" onclick="window.modificarItemCarrito('${item.nombre}', -1)">-</button>
                            <span style="min-width: 20px; text-align:center;">${item.cantidad}</span>
                            <button class="qty-btn" onclick="window.modificarItemCarrito('${item.nombre}', 1)">+</button>
                        </div>
                    </div>
                `;
            });
        }
        
        const totalUsd = this.cart.getTotal();
        document.getElementById('cart-total-usd').innerText = `$${totalUsd.toFixed(2)}`;
        
        if (this.currency.tasaOficial > 0) {
            document.getElementById('cart-total-ves').innerText = `Bs. ${this.currency.convertir(totalUsd)}`;
        } else {
            document.getElementById('cart-total-ves').innerText = 'Bs. --';
        }
    }

    configurarBotonesTabs() {
        const botones = document.querySelectorAll('.tab-btn');
        botones.forEach(btn => {
            btn.addEventListener('click', (e) => this.cambiarTab(e.target.dataset.tab));
        });
    }

    cambiarTab(tabId) {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        document.querySelector(`.tab-btn[data-tab="${tabId}"]`)?.classList.add('active');
        document.getElementById(tabId)?.classList.add('active');
    }

    configurarBotonMoneda() {
        const btnBcv = document.getElementById('btn-bcv');
        btnBcv.addEventListener('click', () => {
            const estadoDolares = this.currency.toggleMoneda();
            if (estadoDolares === null) {
                alert("La tasa del BCV no está disponible en este momento. Inténtalo más tarde.");
                return;
            }
            this.actualizarPreciosUI(estadoDolares);
        });
    }

    actualizarPreciosUI(enDolares) {
        const botonTexto = document.getElementById('texto-moneda');
        botonTexto.innerText = enDolares ? 'VES / USD' : 'USD / VES';
        
        document.querySelectorAll('.precio-valor').forEach(elemento => {
            const dolarBase = parseFloat(elemento.dataset.usd);
            if (enDolares) {
                elemento.innerText = `$${dolarBase.toFixed(2)}`;
            } else {
                elemento.innerText = `Bs. ${this.currency.convertir(dolarBase)}`;
            }
        });
    }

    crearBotonesDePrecio(precios, nombre, esCombo) {
        let buttonsHtml = '';
        precios.forEach(precioObj => {
            let dataNombre = nombre;
            if (nombre === 'Papas') {
                dataNombre = 'Papas ' + precioObj.label;
            } else if (nombre === 'Refresco') {
                dataNombre = precioObj.label === '400ml' ? 'Refresco 400ml' : 'Glup 1 Litro';
            }
            dataNombre = dataNombre.replace(/'/g, "\\'");
            
            let label = precioObj.label;
            if (nombre === 'Refresco') label = precioObj.label;

            // Ahora al hacer clic usamos agregarAlCarrito global
            buttonsHtml += `
                <button 
                    onclick="window.agregarAlCarrito('${dataNombre}', ${precioObj.monto})" 
                    class="btn-whatsapp">
                    ${label}
                </button>`;
        });
        return buttonsHtml;
    }

    crearHTMLCard(producto) {
        const titulo = producto.tituloCard || producto.nombre.toUpperCase();
        const descripcion = producto.desc ? `<p>${producto.desc}</p>` : '';
        const comboClass = producto.esCombo ? 'combo-card' : '';
        
        const textoPrecios = producto.precios.map(p => {
             let labelStr = producto.precios.length > 1 ? p.label + ' ' : '';
             if (producto.nombre === 'Refresco' || producto.nombre === 'Papas') {
                labelStr = p.label + ' ';
             }
             return `${labelStr}<span class="precio-valor" data-usd="${p.monto}">$${p.monto.toFixed(2)}</span>`;
        }).join(' | ');

        const botones = this.crearBotonesDePrecio(producto.precios, producto.nombre, !!producto.esCombo);

        return `
            <div class="card ${comboClass}">
                <div class="card-info">
                    <h3>${titulo}</h3>
                    ${descripcion}
                    <div class="card-footer">
                        <div class="price">${textoPrecios}</div>
                        <div class="action-buttons">
                            ${botones}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderizarMenu() {
        const container = document.querySelector('.menu-sections-container');
        if (!container) return;
        
        container.innerHTML = '';

        for (const categoria in MenuData) {
            const div = document.createElement('div');
            div.id = categoria;
            div.className = `tab-content ${categoria === 'perros' ? 'active' : ''}`;
            
            const htmlTarjetas = MenuData[categoria].map(prod => this.crearHTMLCard(prod)).join('');
            div.innerHTML = htmlTarjetas;
            
            container.appendChild(div);
        }
    }
}
