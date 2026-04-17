/**
 * Servicio de WhatsApp para la generación y apertura de links (SRP)
 */
class WhatsAppService {
    static enviarCarrito(items, totalUsd) {
        if (items.length === 0) return;
        
        let mensaje = `¡Hola! 👋 Quisiera realizar el siguiente pedido:\n\n`;
        
        items.forEach(item => {
            mensaje += `🛒 *${item.cantidad}x* ${item.nombre} ($${(item.precioTotalUSD * item.cantidad).toFixed(2)})\n`;
        });
        
        mensaje += `\n💵 *Total Estimado:* $${totalUsd.toFixed(2)}`;
        
        const url = `https://wa.me/${Config.telefono}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank');
    }
}
