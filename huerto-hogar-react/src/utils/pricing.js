// Ruta: src/utils/pricing.js

/**
 * Precio real de un producto/ítem de carrito: con descuento si corresponde.
 * Única fuente de verdad para "cuánto cuesta esto" en el frontend — evita
 * que carrito, checkout y tarjetas de producto calculen el total cada uno
 * a su manera y terminen mostrando cifras distintas entre sí.
 */
export const getPrecioFinal = (item) =>
  item.precioConDescuento != null ? item.precioConDescuento : item.price;
