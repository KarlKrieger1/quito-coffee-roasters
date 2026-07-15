/**
 * @fileoverview Orquestador central de la aplicación web "Quito Coffee Roasters".
 * Inicializa el catálogo, gestiona el estado del carrito de compras y sincroniza
 * dinámicamente los widgets externos (clima y frases) mediante promesas asíncronas.
 * 
 * @author Karl
 * @version 1.0.0
 * @see {@link https://github.com/KarlKrieger1/quito-coffee-roasters}
 */

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

/**
 * Frase de respaldo predeterminada que se utilizará en la interfaz
 * en caso de que la petición HTTP a la API externa de frases (quotable.io) falle.
 * @type {{text: string, author: string}}
 */
const FALLBACK_QUOTE = {
  text: "Un buen café empieza con paciencia y termina con una sonrisa.",
  author: "Quito Coffee Roasters"
};

/**
 * Estado en memoria del carrito de compras. Se inicializa vacío y
 * se sincroniza localmente con localStorage a través de las funciones de cart.js.
 * @type {Array<Object>}
 */
let cart = [];

/**
 * Almacena el valor de conversión actual recuperado de la API de divisas.
 * Si es null, se cargará bajo demanda cuando el usuario pulse el botón de conversión.
 * @type {number|null}
 */
let currentExchangeRate = null;

/**
 * Renderiza la información climática en el widget ubicado en la sección Hero del DOM.
 * Si el parámetro es null, gestiona visualmente el estado de error.
 * 
 * @param {{temp: number, desc: string}|null} weather - Datos de temperatura y descripción del clima, o null si falló la carga.
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
 * Renderiza la frase del día en el widget del Hero.
 * Si la respuesta es null, utiliza la frase predefinida (FALLBACK_QUOTE) de forma automática.
 * 
 * @param {{text: string, author: string}|null} quote - Objeto de datos con la frase y autor, o null si falló la API.
 */
function renderQuote(quote) {
  const el = document.getElementById("quote-body");
  const data = quote ?? FALLBACK_QUOTE;
  el.textContent = `"${data.text}" — ${data.author}`;
}

/**
 * Recalcula de forma reactiva y actualiza en el DOM todos los valores financieros del pedido:
 * subtotal, costo de envío en función de la zona seleccionada, total en USD, y total en EUR (si se ha activado).
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
 * Sincroniza los criterios actuales de filtrado (texto ingresado en el buscador y
 * origen del chip seleccionado de forma activa) y actualiza el catálogo de productos renderizado.
 */
function refreshCatalog() {
  const searchQuery = document.getElementById("search-input").value;
  const activeChip = document.querySelector(".chip.is-active");
  const selectedOrigin = activeChip ? activeChip.dataset.origin : "todos";

  // catalog.js trata "" como "sin filtro de origen" (ver especificaciones contractuales)
  const origin = selectedOrigin === "todos" ? "" : selectedOrigin;

  const filtered = filterProducts(origin, searchQuery);
  renderProducts(filtered);
}

/**
 * Inicializa y configura de forma centralizada todos los escuchadores de eventos (Event Listeners)
 * de la interfaz de usuario (búsqueda, clics, delegación de eventos, cambios y envíos).
 */
function setupEventListeners() {
  // Búsqueda por nombre en el catálogo (tiempo real)
  document
    .getElementById("search-input")
    .addEventListener("input", refreshCatalog);

  // Filtros interactivos por origen (mediante selección de chips con accesibilidad ARIA)
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

  // Agregar productos al carrito (implementando delegación de eventos sobre la cuadrícula del catálogo)
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

  // Quitar productos del carrito (implementando delegación de eventos sobre la lista del carrito)
  document.getElementById("cart-list").addEventListener("click", (event) => {
    const button = event.target.closest(".cart-item-remove");
    if (!button) return;

    const productId = Number(button.dataset.id);
    cart = removeFromCart(cart, productId);
    renderCart(cart);
    updateTotals();
  });

  // Cambio reactivo de costos según la zona de envío seleccionada
  document
    .getElementById("zone-select")
    .addEventListener("change", updateTotals);

  // Interacción para obtener tasa y convertir el importe total a Euros (EUR)
  document
    .getElementById("eur-toggle")
    .addEventListener("click", async () => {
      if (currentExchangeRate === null) {
        currentExchangeRate = await fetchExchangeRate("USD");
      }
      updateTotals();
    });

  // Captura y envío seguro del formulario de contacto
  document
    .getElementById("contact-form")
    .addEventListener("submit", handleSubmit);

  // Validación en tiempo real con lógica perezosa (lazy load de errores para evitar molestias de UX)
  document
    .querySelectorAll("#contact-form input, #contact-form textarea")
    .forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => {
        // Solo revalida en vivo si el campo ya fue marcado con error previamente
        if (field.closest(".field-group").classList.contains("has-error")) {
          validateField(field);
        }
      });
    });
}

/**
 * Inicializa el punto de entrada principal de la aplicación cuando el DOM está listo.
 * Carga de forma asíncrona en paralelo las llamadas externas para optimizar los tiempos de carga.
 * @async
 */
async function initApp() {
  // Carrito: recuperar datos persistidos en almacenamiento local y renderizar
  cart = loadCart();
  renderCart(cart);
  updateTotals();

  // Catálogo: primer renderizado con el catálogo estático completo
  renderProducts(products);

  // Listeners: activación de todos los eventos del ciclo de vida de la página
  setupEventListeners();

  // Widgets: resolución asíncrona en paralelo sin bloquear el hilo principal de renderizado
  const [weather, quote] = await Promise.all([fetchWeather(), fetchQuote()]);
  renderWeather(weather);
  renderQuote(quote);
}

// Registro global del disparador inicial de ejecución
document.addEventListener("DOMContentLoaded", initApp);