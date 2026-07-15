/**
 * @fileoverview Módulo de gestión del carrito de compras para "Quito Coffee Roasters".
 * Controla el estado del pedido, calcula los costos de envío por zonas, interactúa con 
 * el almacenamiento local (localStorage) para asegurar la persistencia y actualiza el DOM de la cesta.
 * 
 * @author Karl
 * @version 1.0.0
 */

/**
 * Llave utilizada para almacenar la cadena JSON del carrito en el localStorage del navegador.
 * @type {string}
 */
const CART_STORAGE_KEY = "qcr_cart";

/**
 * Tarifas oficiales de envío en dólares (USD) según la zona geográfica en Quito.
 * @type {Object<string, number>}
 */
export const SHIPPING_RATES = {
  Norte: 2.50,
  Centro: 1.80,
  Sur: 3.00,
  Valles: 3.50
};

/**
 * Guarda el estado actual del carrito en el almacenamiento local del navegador (localStorage).
 * Esta función es de uso interno dentro del módulo.
 * 
 * @param {Array<Object>} cart - Arreglo con los elementos actuales del carrito.
 */
function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

/**
 * Recupera y parsea el carrito previamente guardado en localStorage.
 * Si ocurre un error de lectura o no existen registros, retorna un arreglo vacío para prevenir fallos.
 * 
 * @returns {Array<{id: number, name: string, price: number, quantity: number}>} El arreglo de productos del carrito guardados.
 */
export function loadCart() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("loadCart Error:", error);
    return [];
  }
}

/**
 * Agrega un nuevo producto de café al carrito de compras.
 * Si el producto ya se encontraba en el carrito, incrementa su cantidad en 1 unidad de manera inmutable.
 * Sincroniza automáticamente los cambios en el almacenamiento local.
 * 
 * @param {Array<Object>} cart - El estado actual del carrito de compras.
 * @param {{id: number, name: string, price: number}} product - El objeto del producto que se desea agregar.
 * @returns {Array<Object>} El nuevo estado del carrito actualizado.
 */
export function addToCart(cart, product) {
  const existing = cart.find((item) => item.id === product.id);

  let updatedCart;
  if (existing) {
    updatedCart = cart.map((item) =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
    updatedCart = [
      ...cart,
      { id: product.id, name: product.name, price: product.price, quantity: 1 }
    ];
  }

  saveCart(updatedCart);
  return updatedCart;
}

/**
 * Elimina de manera inmutable un artículo de café del carrito basándose en su ID único.
 * Sincroniza el almacenamiento local tras la remoción.
 * 
 * @param {Array<Object>} cart - El estado actual del carrito de compras.
 * @param {number} productId - Identificador único del producto que se removerá.
 * @returns {Array<Object>} El nuevo estado del carrito filtrado sin el artículo especificado.
 */
export function removeFromCart(cart, productId) {
  const updatedCart = cart.filter((item) => item.id !== productId);
  saveCart(updatedCart);
  return updatedCart;
}

/**
 * Calcula de manera pura el subtotal acumulado del pedido, el costo de envío correspondiente 
 * a la zona en Quito seleccionada y el monto total unificado tanto en dólares (USD) como en euros (EUR).
 * 
 * @param {Array<Object>} cart - El estado del carrito con cantidades y precios de los productos.
 * @param {string} zone - Nombre de la zona de destino ("Norte" | "Centro" | "Sur" | "Valles").
 * @param {number|null} [exchangeRate=null] - Tasa de cambio actual de USD a EUR para la conversión bajo demanda.
 * @returns {{subtotal: number, envio: number, totalUSD: number, totalEUR: number|null}} Resultados del balance de importes.
 */
export function calculateTotal(cart, zone, exchangeRate = null) {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const envio = SHIPPING_RATES[zone] ?? 0;
  const totalUSD = subtotal + envio;
  const totalEUR = exchangeRate ? totalUSD * exchangeRate : null;

  return { subtotal, envio, totalUSD, totalEUR };
}

/**
 * Genera e inserta dinámicamente las filas de los productos en el DOM del carrito.
 * Si el carrito está vacío, alterna la visibilidad de la sección de estado vacío y limpia la lista.
 * Al finalizar, calcula y despliega la cantidad total acumulada de artículos en la burbuja de notificación.
 * 
 * @param {Array<{id: number, name: string, price: number, quantity: number}>} cart - El carrito de compras a renderizar.
 */
export function renderCart(cart) {
  const list = document.getElementById("cart-list");
  const emptyState = document.getElementById("cart-empty");
  const cartCount = document.getElementById("cart-count");

  list.innerHTML = "";

  if (cart.length === 0) {
    emptyState.hidden = false;
  } else {
    emptyState.hidden = true;
    cart.forEach((item) => {
      const li = document.createElement("li");
      li.className = "cart-item";
      li.innerHTML = `
        <div>
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-meta">${item.quantity} × $${item.price.toFixed(2)}</p>
        </div>
        <button type="button" class="cart-item-remove" data-id="${item.id}" aria-label="Quitar ${item.name} del pedido">
          Quitar
        </button>
      `;
      list.appendChild(li);
    });
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems.toString();
}