# Plan: Quito Coffee Roasters

## Estructura de archivos
```
quito-coffee-roasters/
├── index.html
├── README.md
├── css/
│   └── styles.css
└── js/
    ├── products.js
    ├── main.js
    ├── apis.js
    ├── catalog.js
    ├── cart.js
    └── contact.js
```

## Contratos de funciones (definitivos)
- apis.js: fetchWeather(lat, lon), fetchQuote(), fetchExchangeRate(base)
  → cada uno retorna Promise con datos o null en error (try/catch interno)
- catalog.js: renderProducts(productsList), filterProducts(origin, searchQuery)
- cart.js: loadCart(), addToCart(product), removeFromCart(productId), 
  calculateTotal(zone, exchangeRate), renderCart(cartArray)
- contact.js: validateField(inputElement) → Boolean, handleSubmit(event)
- main.js: initApp(), setupEventListeners()

## Requisito técnico crítico
index.html debe cargar main.js con: 
<script type="module" src="js/main.js"></script>
Todos los import entre archivos JS requieren extensión .js explícita.

## Contenido de respaldo (fallback)
main.js debe definir una constante FALLBACK_QUOTE = {text, author} 
para mostrar en el Hero si fetchQuote() retorna null. De forma 
similar, si fetchWeather() retorna null, mostrar el mensaje 
"Clima no disponible en este momento" en lugar de dejar el widget vacío.

## Fuera de alcance
- Backend / base de datos real
- Autenticación de usuarios
- Pruebas automatizadas (fuera del tiempo disponible)