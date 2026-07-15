// js/catalog.js

import { products } from './products.js';

/**
 * Genera el marcado HTML para cada producto y lo inyecta en el contenedor principal.
 * Si el listado de productos está vacío, muestra el contenedor #empty-state.
 * @param {Array} productsList - Lista de objetos de café filtrados o completos.
 */
export function renderProducts(productsList) {
  const grid = document.getElementById('products-grid');
  const emptyState = document.getElementById('empty-state');
  
  // Limpiar contenedor
  grid.innerHTML = '';
  
  if (productsList.length === 0) {
    emptyState.removeAttribute('hidden');
    return;
  }
  
  emptyState.setAttribute('hidden', 'true');
  
  productsList.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.setAttribute('data-id', product.id);
    
    card.innerHTML = `
      <div class="product-card__content">
        <span class="product-card__origin">${product.origin}</span>
        <h3 class="product-card__title">${product.name}</h3>
        <p class="product-card__notes">${product.notes}</p>
        <div class="product-card__footer">
          <span class="product-card__price">$${product.price.toFixed(2)}</span>
          <button class="btn btn--primary btn--add-to-cart" data-id="${product.id}">
            Agregar al carrito
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

/**
 * Filtra los productos de forma simultánea combinando el origen y la búsqueda de texto.
 * @param {string} origin - El origen seleccionado (ej. "Ecuador") o "All" / "" para todos.
 * @param {string} searchQuery - El texto de búsqueda ingresado por el usuario.
 * @returns {Array} Listado filtrado de productos que cumplen ambos criterios.
 */
export function filterProducts(origin, searchQuery) {
  const query = searchQuery.toLowerCase().trim();
  const activeOrigin = origin === 'All' || !origin ? '' : origin;

  return products.filter(product => {
    const matchesOrigin = !activeOrigin || product.origin === activeOrigin;
    const matchesQuery = !query || 
      product.name.toLowerCase().includes(query) || 
      product.notes.toLowerCase().includes(query);
      
    return matchesOrigin && matchesQuery;
  });
}