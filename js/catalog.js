/**
 * @fileoverview Módulo del catálogo para "Quito Coffee Roasters".
 * Se encarga de renderizar la cuadrícula de productos en base a plantillas semánticas de HTML5
 * y de ejecutar la lógica de búsqueda y filtrado multi-criterio en tiempo real.
 * 
 * @author Karl
 * @version 1.0.0
 */

import { products } from './products.js';

/**
 * Genera el marcado HTML para cada producto de café e inyecta las tarjetas en el contenedor principal.
 * Si el listado de productos está vacío, remueve el atributo hidden para desplegar un mensaje de estado vacío.
 * 
 * @param {Array<{id: number, name: string, origin: string, notes: string, price: number}>} productsList - Lista de objetos de café a renderizar.
 */
export function renderProducts(productsList) {
  const grid = document.getElementById('products-grid');
  const emptyState = document.getElementById('empty-state');
  
  // Limpiar el contenedor antes de renderizar la nueva selección
  grid.innerHTML = '';
  
  if (productsList.length === 0) {
    emptyState.removeAttribute('hidden');
    return;
  }
  
  emptyState.setAttribute('hidden', 'true');
  
  productsList.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.setAttribute('data-id', product.id.toString());
    
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
 * Filtra los productos de forma simultánea combinando el origen seleccionado y la consulta por texto.
 * Compara los campos de texto convirtiéndolos a minúsculas y limpiando los espacios en blanco extremos.
 * 
 * @param {string} origin - El origen seleccionado (ej. "Ecuador", "Colombia") o cadena vacía para omitir filtro.
 * @param {string} searchQuery - El término de búsqueda introducido por el usuario para filtrar nombres o notas.
 * @returns {Array<Object>} Listado de productos que cumplen simultáneamente ambos criterios de filtrado.
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