import { CurrentWeather, ForecastResponse, WeatherUnit } from "../../client/src/types/weather";

// OpenWeatherMap API base URL
const OPENWEATHER_API_URL = "https://api.openweathermap.org/data/2.5";

// Get API key from environment variables
const API_KEY = process.env.OPENWEATHER_API_KEY || "default_key";

// Track API rate limits
const rateLimitState = {
  lastRequestTime: 0,
  requestCount: 0,
  resetTime: Date.now() + 60000, // Reset every minute
};

// Helper function to handle rate limiting
async function makeRateLimitedRequest(url: string): Promise<Response> {
  // Check if we need to reset the counter
  const now = Date.now();
  if (now > rateLimitState.resetTime) {
    rateLimitState.requestCount = 0;
    rateLimitState.resetTime = now + 60000;
  }
  
  // If we've made too many requests recently, delay a bit
  if (rateLimitState.requestCount >= 50) { // OpenWeather free tier limit is 60 per minute
    const delay = Math.max(100, rateLimitState.resetTime - now);
    await new Promise(resolve => setTimeout(resolve, delay));
    // After waiting, recursively try again with reset counters
    return makeRateLimitedRequest(url);
  }
  
  // Make the request with proper delay between requests
  const timeSinceLastRequest = now - rateLimitState.lastRequestTime;
  if (timeSinceLastRequest < 100 && rateLimitState.lastRequestTime !== 0) {
    await new Promise(resolve => setTimeout(resolve, 100 - timeSinceLastRequest));
  }
  
  // Update rate limit tracking
  rateLimitState.lastRequestTime = Date.now();
  rateLimitState.requestCount++;
  
  // Make the actual request
  return fetch(url);
}

// Get current weather for a location
export async function getCurrentWeather(
  lat: number, 
  lon: number, 
  units: WeatherUnit = 'metric'
): Promise<CurrentWeather> {
  try {
    const url = `${OPENWEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
    
    // Use the rate-limited request function
    const response = await makeRateLimitedRequest(url);
    
    if (!response.ok) {
      if (response.status === 429) {
        // If rate limited, retry after a delay
        console.log("Rate limited by OpenWeatherMap API, retrying after delay...");
        await new Promise(resolve => setTimeout(resolve, 1000));
        return getCurrentWeather(lat, lon, units);
      }
      throw new Error(`OpenWeatherMap API error: ${response.status} ${response.statusText}`);
    }
    
    const data: CurrentWeather = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching current weather:", error);
    
    // Return a useful error object instead of throwing
    if (error instanceof Error) {
      // @ts-ignore - Adding custom properties to the error
      error.isWeatherApiError = true;
      // @ts-ignore
      error.statusCode = error.message.includes("429") ? 429 : 500;
    }
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
    
    // Use the rate-limited request function
    const response = await makeRateLimitedRequest(url);
    
    if (!response.ok) {
      if (response.status === 429) {
        // If rate limited, retry after a delay
        console.log("Rate limited by OpenWeatherMap API, retrying after delay...");
        await new Promise(resolve => setTimeout(resolve, 1000));
        return getForecast(lat, lon, units);
      }
      throw new Error(`OpenWeatherMap API error: ${response.status} ${response.statusText}`);
    }
    
    const data: ForecastResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching forecast:", error);
    
    // Return a useful error object instead of throwing
    if (error instanceof Error) {
      // @ts-ignore - Adding custom properties to the error
      error.isWeatherApiError = true;
      // @ts-ignore
      error.statusCode = error.message.includes("429") ? 429 : 500;
    }
    throw error;
  }
}
