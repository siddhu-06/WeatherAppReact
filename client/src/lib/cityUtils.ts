import { City } from "@/types/city";

export function formatPopulation(population: number): string {
  if (population >= 1000000) {
    return `${(population / 1000000).toFixed(2)} million`;
  } else if (population >= 1000) {
    return `${(population / 1000).toFixed(0)}K`;
  }
  return population.toString();
}

export function formatTimezone(timezone: string): string {
  // Convert "America/New_York" to a more readable "America / New York" format
  return timezone.replace('_', ' ').replace('/', ' / ');
}

export function getLocalTime(timezone: string): string {
  try {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    return new Intl.DateTimeFormat('en-US', options).format(now);
  } catch (error) {
    console.error("Error formatting time for timezone", timezone, error);
    return new Date().toLocaleString();
  }
}

export function formatCoordinates(lat: number | string, lon: number | string): string {
  // Convert to numbers if they're strings
  const numLat = typeof lat === 'string' ? parseFloat(lat) : lat;
  const numLon = typeof lon === 'string' ? parseFloat(lon) : lon;
  
  // Check if conversion resulted in valid numbers
  if (isNaN(numLat) || isNaN(numLon)) {
    return 'Invalid coordinates';
  }
  
  const latDir = numLat >= 0 ? "N" : "S";
  const lonDir = numLon >= 0 ? "E" : "W";
  return `${Math.abs(numLat).toFixed(4)}° ${latDir}, ${Math.abs(numLon).toFixed(4)}° ${lonDir}`;
}

export function cityToSearchParam(city: City): string {
  return encodeURIComponent(city.name);
}
