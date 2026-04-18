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

    async init() {
        this.configurarBotonesTabs();
        this.configurarBotonMoneda();
        this.configurarPagoMovilBtn();
        this.configurarCarritoBtn();
        await this.renderizarMenu();
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
            const totalUsd = this.cart.getTotal();
            const totalBs = this.currency.tasaOficial > 0 ? this.currency.convertir(totalUsd) : 0;
            WhatsAppService.enviarCarrito(this.cart.getItems(), totalUsd, totalBs);
        });
    }

    configurarPagoMovilBtn() {
        const btnPm = document.getElementById('btn-pm');
        const modalPm = document.getElementById('pm-modal');
        const closePm = document.getElementById('close-pm');
        const btnCopy = document.getElementById('btn-copy-pm');
        const feedback = document.getElementById('pm-copy-feedback');

        if (btnPm && modalPm && closePm) {
            btnPm.addEventListener('click', () => {
                modalPm.classList.add('show');
            });

            closePm.addEventListener('click', () => {
                modalPm.classList.remove('show');
            });

            window.addEventListener('click', (event) => {
                if (event.target == modalPm) {
                    modalPm.classList.remove('show');
                }
            });
        }

        const btnMinis = document.querySelectorAll('.btn-copy-mini');
        btnMinis.forEach(btn => {
            btn.addEventListener('click', () => {
                const text = btn.getAttribute('data-copy');
                navigator.clipboard.writeText(text).then(() => {
                    feedback.innerText = `¡Dato copiado!`;
                    feedback.style.opacity = '1';
                    setTimeout(() => {
                        feedback.style.opacity = '0';
                    }, 2500);
                });
            });
        });

        if (btnCopy) {
            btnCopy.addEventListener('click', () => {
                const textToCopy = "0102\n04243344673\n8997068";
                navigator.clipboard.writeText(textToCopy).then(() => {
                    feedback.style.opacity = '1';
                    setTimeout(() => {
                        feedback.style.opacity = '0';
                    }, 2500);
                }).catch(err => {
                    console.error('Error al copiar: ', err);
                });
            });
        }
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
            document.getElementById('cart-total-ves').innerText = `Bs. ${this.currency.convertir(totalUsd).toFixed(2)}`;
        } else {
            document.getElementById('cart-total-ves').innerText = 'Bs. --';
        }
    }

    configurarBotonesTabs() {
        const tabsContainer = document.querySelector('.tabs');
        if (tabsContainer) {
            // Event delegation for tab buttons
            tabsContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('.tab-btn');
                if (btn) this.cambiarTab(btn.dataset.tab);
            });

            // Drag to scroll logic
            let isDown = false;
            let startX;
            let scrollLeft;

            tabsContainer.addEventListener('mousedown', (e) => {
                isDown = true;
                tabsContainer.style.cursor = 'grabbing';
                startX = e.pageX - tabsContainer.offsetLeft;
                scrollLeft = tabsContainer.scrollLeft;
            });
            tabsContainer.addEventListener('mouseleave', () => {
                isDown = false;
                tabsContainer.style.cursor = 'grab';
            });
            tabsContainer.addEventListener('mouseup', () => {
                isDown = false;
                tabsContainer.style.cursor = 'grab';
            });
            tabsContainer.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - tabsContainer.offsetLeft;
                const walk = (x - startX) * 2; // Scroll-fast
                tabsContainer.scrollLeft = scrollLeft - walk;
            });
        }
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
                elemento.innerText = `Bs. ${this.currency.convertir(dolarBase).toFixed(2)}`;
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
            } else if (precioObj.label.toLowerCase() === 'un combo') {
                dataNombre = 'Combo ' + nombre;
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
            return `${labelStr}<span class="precio-valor" data-price-id="${p.id}" data-usd="${p.monto}">$${p.monto.toFixed(2)}</span>`;
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

    async renderizarMenu() {
        const container = document.querySelector('.menu-sections-container');
        if (!container) return;

        // Renderizar Skeletons iniciales
        container.innerHTML = `
            <div class="tab-content active" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
                <div class="skeleton skeleton-card"></div>
                <div class="skeleton skeleton-card"></div>
                <div class="skeleton skeleton-card"></div>
                <div class="skeleton skeleton-card"></div>
                <div class="skeleton skeleton-card"></div>
                <div class="skeleton skeleton-card"></div>
            </div>
        `;

        // El objeto supabaseConfig ya está disponible globalmente
        const { createClient } = supabase;
        const supabaseClient = createClient(supabaseConfig.url, supabaseConfig.anonKey);

        // Fetch de categorías, productos y precios
        const { data: categories } = await supabaseClient.from('categories').select('*').order('id');
        const { data: products } = await supabaseClient.from('products').select('*, prices(*)');

        if (!categories || !products) {
            container.innerHTML = '<p style="text-align:center; padding: 20px; color: red;">Error al cargar el menú.</p>';
            return;
        }

        const tabsNav = document.getElementById('category-tabs-container');
        if (tabsNav) {
            tabsNav.innerHTML = categories.map((cat, index) =>
                `<button class="tab-btn ${index === 0 ? 'active' : ''}" data-tab="${cat.slug}">${cat.name}</button>`
            ).join('');
        }

        container.innerHTML = '';

        categories.forEach((category, index) => {
            const div = document.createElement('div');
            div.id = category.slug;
            div.className = `tab-content ${index === 0 ? 'active' : ''}`;

            const catProducts = products.filter(p => p.category_id === category.id);
            const htmlTarjetas = catProducts.map(prod => {
                // Adaptar el objeto de la DB al formato que espera crearHTMLCard
                const adaptedProd = {
                    nombre: prod.name,
                    desc: prod.description,
                    tituloCard: prod.titulo_card,
                    esCombo: prod.is_combo,
                    precios: prod.prices.map(pr => {
                        let finalLabel = pr.label;
                        if (category.slug === 'perros' && pr.label.toLowerCase() === '2x') {
                            finalLabel = 'Un combo';
                        }
                        return { id: pr.id, label: finalLabel, monto: parseFloat(pr.amount) };
                    })
                };
                return this.crearHTMLCard(adaptedProd);
            }).join('');

            div.innerHTML = htmlTarjetas;
            container.appendChild(div);
        });

        this.setupRealtime(supabaseClient);
    }

    setupRealtime(client) {
        client
            .channel('any')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'prices' }, payload => {
                const { id, amount } = payload.new;
                const elements = document.querySelectorAll(`[data-usd][id="price-${id}"], [data-usd].precio-valor`);
                // Como los IDs de los elementos de precio no son únicos por producto (pueden estar en varias partes),
                // buscamos por data-usd que coincida con el ID de la base de datos si fuera necesario.
                // Pero lo más simple es buscar todos los .precio-valor que tengan el dataset id correspondiente.

                document.querySelectorAll(`.precio-valor[data-price-id="${id}"]`).forEach(el => {
                    const newPrice = parseFloat(amount);
                    el.dataset.usd = newPrice;
                    if (this.currency.monedaActual === 'USD') {
                        el.innerText = `$${newPrice.toFixed(2)}`;
                    } else {
                        el.innerText = `Bs. ${this.currency.convertir(newPrice).toFixed(2)}`;
                    }
                });
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'products' }, payload => {
                // Si cambia el nombre o desc, podríamos recargar o actualizar campos
                // Por ahora priorizamos precios que es lo más dinámico
            })
            .subscribe();
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
}
