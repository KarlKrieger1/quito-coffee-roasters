// js/main.js
import { products } from "./products.js";
import { fetchWeather, fetchQuote, fetchExchangeRate } from "./apis.js";
import { renderProducts, filterProducts } from "./catalog.js";
import { validateField } from "./contact.js";
import {
  loadCart,
  addToCart,
  removeFromCart,
  calculateTotal,
  renderCart
} from "./cart.js";
import { handleSubmit } from "./contact.js";

// Frase de respaldo si fetchQuote() falla (ver constitution.md / plan.md)
const FALLBACK_QUOTE = {
  text: "Un buen café empieza con paciencia y termina con una sonrisa.",
  author: "Quito Coffee Roasters"
};

// Estado del carrito en memoria, se sincroniza con localStorage vía cart.js
let cart = [];
let currentExchangeRate = null;

/**
 * Pinta el widget de clima en el Hero.
 * @param {{temp: number, desc: string}|null} weather
 */
function renderWeather(weather) {
  const el = document.getElementById("weather-body");
  if (!weather) {
    el.innerHTML = `<span class="widget-error">Clima no disponible en este momento.</span>`;
    return;
  }
  el.textContent = `${Math.round(weather.temp)}°C · ${weather.desc}`;
}

/**
 * Pinta el widget de frase del día en el Hero.
 * @param {{text: string, author: string}|null} quote
 */
function renderQuote(quote) {
  const el = document.getElementById("quote-body");
  const data = quote ?? FALLBACK_QUOTE;
  el.textContent = `"${data.text}" — ${data.author}`;
}

/**
 * Recalcula y pinta los totales del pedido según la zona seleccionada.
 */
function updateTotals() {
  const zone = document.getElementById("zone-select").value;
  const { subtotal, envio, totalUSD, totalEUR } = calculateTotal(
    cart,
    zone,
    currentExchangeRate
  );

  document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("shipping").textContent = `$${envio.toFixed(2)}`;
  document.getElementById("total-usd").textContent = `$${totalUSD.toFixed(2)}`;

  const eurEl = document.getElementById("total-eur");
  if (totalEUR !== null) {
    eurEl.textContent = `≈ €${totalEUR.toFixed(2)} EUR`;
    eurEl.hidden = false;
  } else {
    eurEl.hidden = true;
  }
}

/**
 * Aplica el filtro/búsqueda actual del catálogo y vuelve a renderizar.
 */
function refreshCatalog() {
  const searchQuery = document.getElementById("search-input").value;
  const activeChip = document.querySelector(".chip.is-active");
  const selectedOrigin = activeChip ? activeChip.dataset.origin : "todos";

  // catalog.js trata "" (o "All") como "sin filtro de origen" (ver contrato)
  const origin = selectedOrigin === "todos" ? "" : selectedOrigin;

  const filtered = filterProducts(origin, searchQuery);
  renderProducts(filtered);
}

/**
 * Registra todos los escuchadores de eventos de la aplicación.
 */
function setupEventListeners() {
  // Búsqueda por nombre
  document
    .getElementById("search-input")
    .addEventListener("input", refreshCatalog);

  // Filtros por origen (chips)
  document.getElementById("origin-filters").addEventListener("click", (event) => {
    const chip = event.target.closest(".chip");
    if (!chip) return;

    document
      .querySelectorAll(".chip")
      .forEach((c) => {
        c.classList.remove("is-active");
        c.setAttribute("aria-pressed", "false");
      });
    chip.classList.add("is-active");
    chip.setAttribute("aria-pressed", "true");

    refreshCatalog();
  });

  // Agregar al carrito (delegación de eventos sobre el grid de productos)
  document.getElementById("products-grid").addEventListener("click", (event) => {
    const button = event.target.closest(".btn--add-to-cart");
    if (!button) return;

    const productId = Number(button.dataset.id);
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    cart = addToCart(cart, product);
    renderCart(cart);
    updateTotals();
  });

  // Quitar del carrito (delegación de eventos sobre la lista del carrito)
  document.getElementById("cart-list").addEventListener("click", (event) => {
    const button = event.target.closest(".cart-item-remove");
    if (!button) return;

    const productId = Number(button.dataset.id);
    cart = removeFromCart(cart, productId);
    renderCart(cart);
    updateTotals();
  });

  // Cambio de zona de envío
  document
    .getElementById("zone-select")
    .addEventListener("change", updateTotals);

  // Conversión a EUR
  document
    .getElementById("eur-toggle")
    .addEventListener("click", async () => {
      if (currentExchangeRate === null) {
        currentExchangeRate = await fetchExchangeRate("USD");
      }
      updateTotals();
    });

  // Envío del formulario de contacto
  document
    .getElementById("contact-form")
    .addEventListener("submit", handleSubmit);

  // Validación en tiempo real de cada campo (al perder el foco y al escribir)
  document
    .querySelectorAll("#contact-form input, #contact-form textarea")
    .forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => {
        // Solo revalida en vivo si el campo ya fue marcado con error antes,
        // para no mostrar errores mientras el usuario recién empieza a escribir
        if (field.closest(".field-group").classList.contains("has-error")) {
          validateField(field);
        }
      });
    });
}

/**
 * Punto de entrada de la aplicación.
 */
async function initApp() {
  // Carrito: recuperar de localStorage y pintar de inmediato
  cart = loadCart();
  renderCart(cart);
  updateTotals();

  // Catálogo: render inicial con todos los productos
  renderProducts(products);

  // Listeners
  setupEventListeners();

  // APIs del Hero: en paralelo, sin bloquear el resto de la página
  const [weather, quote] = await Promise.all([fetchWeather(), fetchQuote()]);
  renderWeather(weather);
  renderQuote(quote);
}

document.addEventListener("DOMContentLoaded", initApp);