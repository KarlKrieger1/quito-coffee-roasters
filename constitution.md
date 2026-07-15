# Constitution: Quito Coffee Roasters

## 1. Modularidad
Cada archivo JS tiene una sola responsabilidad. Ninguna función hace 
fetch y renderizado a la vez.

## 2. Resiliencia
Ninguna llamada a API puede romper la aplicación. Toda función 
fetch* captura sus propios errores y retorna null en caso de falla.

## 3. Persistencia
El estado del carrito sobrevive a un refresh de página vía localStorage.

## 4. Accesibilidad
Todo elemento interactivo debe ser navegable y entendible sin mouse 
(atributos ARIA, labels asociados a inputs).

## 5. Sin dependencias externas
Solo HTML5, CSS3 y JavaScript nativo (ES6+ con módulos). Sin frameworks, 
sin librerías, sin bundlers.