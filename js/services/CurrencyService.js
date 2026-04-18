/**
 * Servicio de control de monedas y API
 */
class CurrencyService {
    constructor() {
        this.tasaOficial = 0;
        this.enDolares = true;
        this.onTasaObtenida = null; // Callback
    }

    async obtenerTasa() {
        try {
            const respuesta = await fetch(Config.apiBCV, {
                headers: { 'X-API-Key': Config.apiKeyBCV }
            });
            if (!respuesta.ok) throw new Error('Conexión fallida con API de BCV');
            
            const datos = await respuesta.json();
            this.tasaOficial = datos.tasa;
            if (this.onTasaObtenida) this.onTasaObtenida(this.tasaOficial);
        } catch (error) {
            console.error('Error obteniendo la tasa:', error);
            if (this.onTasaObtenida) this.onTasaObtenida(null); // Falló
        }
    }

    toggleMoneda() {
        if (this.tasaOficial === 0) return null;
        this.enDolares = !this.enDolares;
        return this.enDolares;
    }

    convertir(monto) {
        return monto * this.tasaOficial;
    }
}
