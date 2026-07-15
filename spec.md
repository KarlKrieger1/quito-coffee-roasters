# Spec: Quito Coffee Roasters

## Propósito
SPA responsive para una tostadería de café que muestra catálogo, 
calcula pedidos con envío, consume clima/frase/tipo de cambio vía 
API, y captura contacto de clientes.

## Secciones funcionales
1. Hero: clima (Open-Meteo) + frase (Quotable), con spinner y fallback
2. Catálogo: búsqueda + filtro por origen (Ecuador, Colombia, Brasil, Etiopía)
3. Carrito: agregar/quitar cafés, zona de envío, conversión opcional a EUR
4. Formulario de contacto: validación en tiempo real
5. Footer: estático (contacto, horarios, redes, créditos)

## Criterios de aceptación
- Clima y frase se cargan sin bloquear la página; si fallan, se 
  muestra contenido de respaldo, nunca un hueco vacío ni un crash
- Buscar "Tostado" + filtrar "Ecuador" devuelve solo cafés que 
  cumplen ambos criterios simultáneamente
- Agregar un café al carrito, recargar la página, el carrito persiste
- Seleccionar zona de envío recalcula el total inmediatamente
- Enviar formulario con email inválido bloquea el envío y muestra 
  error específico en ese campo
- Responsive correcto en móvil, tablet y desktop