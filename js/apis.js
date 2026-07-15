// js/apis.js

/**
 * Consulta la API de Open-Meteo para obtener el clima actual de Quito.
 * Coordenadas de Quito por defecto: Latitud -0.217, Longitud -78.509
 * @param {number} lat 
 * @param {number} lon 
 * @returns {Promise<{temp: number, desc: string}|null>}
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

    // Traducir los códigos de clima de Open-Meteo más comunes a texto amigable
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
 * Consulta la API de Quotable para obtener la frase inspiracional del día.
 * Si falla, retorna null para que el orquestador cargue la frase de respaldo.
 * @returns {Promise<{text: string, author: string}|null>}
 */
export async function fetchQuote() {
  try {
    // Usamos el endpoint público de Quotable
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
 * Consulta open.er-api.com para obtener la tasa de cambio USD -> EUR.
 * No requiere API Key ni registros.
 * @param {string} baseCurrency 
 * @returns {Promise<number|null>}
 */
export async function fetchExchangeRate(baseCurrency = "USD") {
  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`);
    if (!response.ok) throw new Error("Error en la respuesta de ExchangeRate API");
    
    const data = await response.json();
    const rate = data.rates.EUR;
    if (!rate) throw new Error("Tasa de cambio EUR no encontrada");
    
    return rate;
  } catch (error) {
    console.error("fetchExchangeRate Error:", error);
    return null;
  }
}