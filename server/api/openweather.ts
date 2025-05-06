import { CurrentWeather, ForecastResponse, WeatherUnit } from "../../client/src/types/weather";

// OpenWeatherMap API base URL
const OPENWEATHER_API_URL = "https://api.openweathermap.org/data/2.5";

// Get API key from environment variables
const API_KEY = process.env.OPENWEATHER_API_KEY || "default_key";

// Get current weather for a location
export async function getCurrentWeather(
  lat: number, 
  lon: number, 
  units: WeatherUnit = 'metric'
): Promise<CurrentWeather> {
  try {
    const url = `${OPENWEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`OpenWeatherMap API error: ${response.status} ${response.statusText}`);
    }
    
    const data: CurrentWeather = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching current weather:", error);
    throw error;
  }
}

// Get 5-day forecast for a location
export async function getForecast(
  lat: number, 
  lon: number, 
  units: WeatherUnit = 'metric'
): Promise<ForecastResponse> {
  try {
    const url = `${OPENWEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`OpenWeatherMap API error: ${response.status} ${response.statusText}`);
    }
    
    const data: ForecastResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching forecast:", error);
    throw error;
  }
}
