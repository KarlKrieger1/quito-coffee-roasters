/**
 * @fileoverview Módulo de integración de servicios y APIs web externas para "Quito Coffee Roasters".
 * Gestiona el consumo asíncrono de datos climatológicos (Open-Meteo), citas célebres (Quotable)
 * y tipos de cambio de divisas en tiempo real (ExchangeRate-API).
 * Cada función implementa captura robusta de errores para garantizar la resiliencia del frontend.
 * 
 * @author Karl
 * @version 1.0.0
 */

/**
 * Consulta la API pública de Open-Meteo para obtener las condiciones meteorológicas en tiempo real.
 * Si la petición falla, retorna null de manera segura sin interrumpir el flujo de ejecución principal.
 * 
 * Coordenadas geográficas por defecto (Quito, Ecuador): Latitud -0.217, Longitud -78.509.
 * 
 * @param {number} [lat=-0.217] - Latitud geográfica de la consulta.
 * @param {number} [lon=-78.509] - Longitud geográfica de la consulta.
 * @returns {Promise<{temp: number, desc: string}|null>} Objeto con temperatura y descripción climática traducida, o null si falla.
 */
export async function fetchWeather(lat = -0.217, lon = -78.509) {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );
    if (!response.ok) throw new Error("Error en la respuesta de Open-Meteo");
    
    const data = await response.json();
    const temp = data.current_weather.temperature;
    const code = data.current_weather.weathercode;

    // Traducir los códigos de clima de Open-Meteo más comunes a texto amigable para el cliente
    let desc = "Despejado";
    if (code >= 1 && code <= 3) desc = "Parcialmente nublado";
    else if (code >= 45 && code <= 48) desc = "Neblina";
    else if (code >= 51 && code <= 67) desc = "Llovizna leve";
    else if (code >= 71 && code <= 82) desc = "Lluvia / Chubascos";
    else if (code >= 95) desc = "Tormenta";

    return { temp, desc };
  } catch (error) {
    console.error("fetchWeather Error:", error);
    return null;
  }
}

/**
 * Consulta la API pública de Quotable para obtener una cita inspiradora de forma aleatoria.
 * Si ocurre un error de red o de seguridad de dominio (ej. certificado SSL expirado), 
 * retorna null de inmediato para que el orquestador principal (main.js) cargue la frase de respaldo local.
 * 
 * @returns {Promise<{text: string, author: string}|null>} Objeto con el texto de la cita y su autor, o null si falla.
 */
export async function fetchQuote() {
  try {
    // Se realiza el consumo utilizando etiquetas filtradas de inspiración y sabiduría
    const response = await fetch("https://api.quotable.io/random?tags=inspirational|wisdom");
    if (!response.ok) throw new Error("Error en la respuesta de Quotable");
    
    const data = await response.json();
    return {
      text: data.content,
      author: data.author
    };
  } catch (error) {
    console.error("fetchQuote Error:", error);
    return null;
  }
}

/**
 * Consulta el servicio abierto de ExchangeRate API para obtener la tasa de cambio actual de USD a EUR.
 * No requiere API key ni firmas de acceso, permitiendo consultas rápidas en el cliente.
 * 
 * @param {string} [baseCurrency="USD"] - Código de tres letras ISO de la divisa base a cotizar.
 * @returns {Promise<number|null>} Multiplicador de conversión (tasa de cambio) a euros (EUR), o null si falla.
 */
export async function fetchExchangeRate(baseCurrency = "USD") {
  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`);
    if (!response.ok) throw new Error("Error en la respuesta de ExchangeRate API");
    
    const data = await response.json();
    const rate = data.rates.EUR;
    if (!rate) throw new Error("Tasa de cambio EUR no encontrada en los datos de respuesta");
    
    return rate;
  } catch (error) {
    console.error("fetchExchangeRate Error:", error);
    return null;
  }
}