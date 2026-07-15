// js/cart.js

const CART_STORAGE_KEY = "qcr_cart";

export const SHIPPING_RATES = {
  Norte: 2.50,
  Centro: 1.80,
  Sur: 3.00,
  Valles: 3.50
};

/**
 * Guarda el carrito actual en localStorage.
 * Función interna, no forma parte del contrato público.
 * @param {Array} cart
 */
function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

/**
 * Recupera el carrito guardado en localStorage.
 * @returns {Array} el carrito guardado, o un array vacío si no existe
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
 * Agrega un café al carrito. Si ya existe, incrementa su cantidad.
 * @param {Array} cart - carrito actual
 * @param {{id: number, name: string, price: number}} product
 * @returns {Array} el carrito actualizado
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
 * Elimina un café del carrito por su ID.
 * @param {Array} cart - carrito actual
 * @param {number} productId
 * @returns {Array} el carrito actualizado
 */
export function removeFromCart(cart, productId) {
  const updatedCart = cart.filter((item) => item.id !== productId);
  saveCart(updatedCart);
  return updatedCart;
}

/**
 * Calcula subtotal, envío y total (USD y opcionalmente EUR).
 * @param {Array} cart
 * @param {string} zone - "Norte" | "Centro" | "Sur" | "Valles"
 * @param {number|null} exchangeRate - tasa USD -> EUR, opcional
 * @returns {{subtotal: number, envio: number, totalUSD: number, totalEUR: number|null}}
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
 * Pinta la lista de ítems del carrito en el DOM.
 * @param {Array} cart
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
  cartCount.textContent = totalItems;
}