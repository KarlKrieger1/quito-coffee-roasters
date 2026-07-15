# Quito Coffee Roasters ☕

Proyecto académico de desarrollo frontend que simula una experiencia de e-commerce para una cafetería de especialidad ubicada en el Centro Histórico de Quito. Desarrollado con una arquitectura limpia de JavaScript modular (ES Modules), maquetación semántica y un fuerte enfoque en accesibilidad web (A11y).

---

## 🚀 Características Clave

* **Arquitectura Modular (ES Modules):** Código altamente organizado y mantenible, utilizando `import` y `export` nativos para separar responsabilidades de manera limpia.
* **Accesibilidad Web (A11y):** Diseñado bajo estándares WCAG para garantizar una experiencia inclusiva:
  * Enlace de salto rápido (*Skip Link*) para navegación ágil por teclado.
  * Uso de roles semánticos y atributos ARIA (`aria-expanded`, `aria-live`, `aria-describedby`).
  * Alertas dinámicas y accesibles para lectores de pantalla en validación de formularios y actualizaciones de carrito.
* **Catálogo Interactivo:** Búsqueda en tiempo real e interactiva por texto y filtros por origen del grano (Ecuador, Colombia, Brasil, Etiopía).
* **Carrito de Compras Reactivo:**
  * Cálculo dinámico de costos de envío basado en zonas geográficas de Quito.
  * Conversión asíncrona de divisa (USD a EUR) utilizando APIs externas de tipo de cambio.
* **Consumo de APIs Asíncronas (Fetch API):**
  * Integración con el clima en tiempo real de Quito mediante **Open-Meteo API**.
  * Carga asíncrona de frases célebres mediante API de citas (con sistema de *fallback* local ante fallas de red para asegurar que el diseño nunca se rompa).
* **Validación de Formulario Robusta:** Control estricto de errores de entrada en el formulario de contacto con mensajes accesibles antes de permitir el envío del formulario.

---

## 📂 Estructura del Proyecto

La estructura del repositorio sigue un flujo de responsabilidades bien definido:

```text
quito-coffee-roasters/
│
├── index.html          # Estructura semántica, accesibilidad y puntos de montaje
├── README.md           # Presentación y documentación del proyecto
│
├── css/
│   └── styles.css      # Hoja de estilos unificada (layouts, widgets, responsive)
│
└── js/
    ├── main.js         # Orquestador del ciclo de vida y punto de entrada de la app
    ├── products.js     # Base de datos local de productos de café
    ├── catalog.js      # Lógica de renderizado y filtrado dinámico del catálogo
    ├── cart.js         # Gestión del carrito, cálculo de envíos y conversión de divisas
    ├── contact.js      # Validación accesible y envío del formulario de contacto
    └── apis.js         # Módulo encargado de llamadas externas (Fetch API)
```

---

## 🛠️ Tecnologías Utilizadas

* **HTML5** (Estructura semántica)
* **CSS3** (Variables CSS, Flexbox, Grid, Responsive Design)
* **JavaScript Moderno (ES6+)** (Clases, Async/Await, ES Modules)
* **APIs Externas** (Open-Meteo API para datos meteorológicos y Quotable para las citas)

---

## ⚠️ ¿Por qué es necesario usar un Servidor Local (localhost) para desarrollo?

Si intentas abrir el archivo `index.html` haciendo **doble clic directamente desde tu explorador de archivos** (usando el protocolo `file://` en la barra de direcciones de tu navegador), notarás que **el catálogo de productos no se muestra y los widgets dinámicos del clima y la frase se quedan cargando infinitamente**.

### La razón técnica (CORS):

Los navegadores modernos implementan una estricta política de seguridad llamada **CORS (Cross-Origin Resource Sharing)**. Cuando el proyecto se abre como un archivo local (`file:///...`), el navegador bloquea por seguridad la importación de módulos de JavaScript externos (`import`/`export`) y las peticiones asíncronas de datos (`fetch`).

Para solucionar esto y permitir que todos los componentes, módulos y consultas de APIs externas funcionen correctamente, debemos servir el proyecto bajo el protocolo seguro **`http://`** utilizando un servidor web local (`localhost`).

---

## ⚙️ Cómo Ejecutar el Proyecto en Local

### Opción 1: Usando la Terminal (Python)

Python incluye un servidor web básico ideal para desarrollo. Abre tu terminal de confianza en la raíz del proyecto y ejecuta el siguiente comando:

```bash
python -m http.server 8000
```

Una vez que el servidor esté corriendo, abre tu navegador web preferido e ingresa a la siguiente dirección:

```text
http://localhost:8000
```

*¡Listo! Al usar http://, el navegador cargará correctamente los módulos JS, renderizará el catálogo de inmediato y actualizará los widgets con los datos asíncronos en tiempo real.*

### Opción 2: Usando Visual Studio Code (Extensión Live Server)

Si utilizas VS Code, puedes automatizar este proceso:

1. Abre la carpeta del proyecto en **Visual Studio Code**.
2. Ve a la pestaña de extensiones e instala **Live Server** (creada por Ritwick Dey).
3. Con el proyecto abierto, haz clic en el botón **"Go Live"** en la barra de estado inferior derecha.
4. Se abrirá automáticamente tu navegador apuntando a un puerto local (por ejemplo, `http://127.0.0.1:5500`), cargando el proyecto con todas sus funciones habilitadas.

---

## 🌐 Despliegue en Producción (GitHub Pages)

Este proyecto está configurado para desplegarse de manera estática y automática a través de **GitHub Pages** utilizando el protocolo seguro **HTTPS**. Al servirse de esta forma, el navegador carga los módulos nativos de JavaScript correctamente y se evitan conflictos de *Mixed Content* al conectarse a las APIs asíncronas externas de clima y conversión de divisas.

### Enlace del proyecto en vivo:
*   [Sitio Web Oficial de Quito Coffee Roasters](https://karlkrieger1.github.io/quito-coffee-roasters/)

---

## 👤 Autor

* **Desarrollador Frontend**
  * GitHub: [Quito Coffee Roasters Repository](https://github.com/KarlKrieger1/quito-coffee-roasters)

---

*Proyecto académico desarrollado con fines educativos — 2026.*