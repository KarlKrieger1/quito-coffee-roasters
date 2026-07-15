/**
 * @fileoverview Catálogo estático de productos para "Quito Coffee Roasters".
 * Actúa como la base de datos local en memoria del sitio, definiendo los cafés de especialidad
 * disponibles con sus respectivos orígenes, notas de cata sensoriales y precios unitarios.
 * 
 * @author Karl
 * @version 1.0.0
 */

/**
 * @typedef {Object} CoffeeProduct
 * @property {number} id - Identificador único incremental del producto.
 * @property {string} name - Nombre comercial del lote de café de especialidad.
 * @property {string} origin - País de origen de la cosecha (utilizado para el filtrado reactivo).
 * @property {string} notes - Descriptor sensorial y notas de cata del perfil de tueste.
 * @property {number} price - Costo unitario del producto en dólares americanos (USD).
 */

/**
 * Listado oficial de cafés de especialidad disponibles en la plataforma.
 * @type {Array<CoffeeProduct>}
 */
export const products = [
  {
    id: 1,
    name: "Volcán Pichincha",
    origin: "Ecuador",
    notes: "Chocolate amargo, notas cítricas de naranja y cuerpo medio.",
    price: 12.50
  },
  {
    id: 2,
    name: "Sierra Nevada",
    origin: "Colombia",
    notes: "Caramelo dulce, frutos rojos y una acidez brillante balanceada.",
    price: 14.00
  },
  {
    id: 3,
    name: "Cerrado Dulce",
    origin: "Brasil",
    notes: "Frutos secos tostados, cacao fino y un cuerpo sumamente denso.",
    price: 11.00
  },
  {
    id: 4,
    name: "Yirgacheffe",
    origin: "Etiopía",
    notes: "Notas florales a jazmín, sutil té de limón y un final limpio.",
    price: 16.50
  }
];