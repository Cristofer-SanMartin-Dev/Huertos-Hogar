// src/utils/share.js

/**
 * Comparte un producto usando la API nativa del navegador (abre el panel de
 * compartir del sistema operativo) y, si no está disponible, recurre a un
 * enlace real de WhatsApp. No enlaza a perfiles de redes sociales de la
 * empresa (no existen, es un proyecto educativo): esto comparte contenido
 * real a las cuentas del propio usuario.
 */
export function shareProduct(product) {
    const url = window.location.href;
    const text = `Mira "${product.name}" en HuertoHogar`;

    if (navigator.share) {
        navigator.share({ title: product.name, text, url }).catch(() => {
            // El usuario canceló el panel de compartir; no hacemos nada.
        });
        return;
    }

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}
