import { City, CitySearchParams, AutocompleteSuggestion } from "../../client/src/types/city";

// The base URL for the Geonames API
const GEONAMES_API_URL = "https://public.opendatasoft.com/api/records/1.0/search/";
const DATASET = "geonames-all-cities-with-a-population-1000";

interface GeonamesResponse {
  nhits: number;
  parameters: any;
  records: {
    datasetid: string;
    recordid: string;
    fields: {
      name: string;
      ascii_name: string;
      alternate_names?: string;
      feature_code: string;
      country_code: string;
      cou_name_en: string;
      population: number;
      dem: number;
      timezone: string;
      coordinates: [number, number]; // [latitude, longitude]
    };
    geometry: {
      type: string;
      coordinates: [number, number]; // [longitude, latitude]
    };
  }[];
}

// Convert Geonames API response to our City type
function mapRecordToCity(record: GeonamesResponse["records"][0]): City {
  const { fields, recordid } = record;
  
  return {
    id: recordid,
    name: fields.name,
    ascii_name: fields.ascii_name,
    alternate_names: fields.alternate_names?.split(','),
    country_code: fields.country_code,
    cou_name_en: fields.cou_name_en,
    population: fields.population,
    timezone: fields.timezone,
    coordinates: {
      lat: String(fields.coordinates[0]),
      lon: String(fields.coordinates[1])
    }
  };
}

// Get cities with pagination and filtering
export async function getCities(params: CitySearchParams): Promise<{ cities: City[]; total: number; hasMore: boolean }> {
  const {
    query,
    countryCode,
    populationMin,
    timezone,
    sort = 'name',
    sortDirection = 'asc',
    offset = 0,
    limit = 20
  } = params;
  
  // Build query parameters
  const searchParams = new URLSearchParams();
  searchParams.append("dataset", DATASET);
  searchParams.append("rows", limit.toString());
  searchParams.append("start", offset.toString());
  
  // Add sorting
  searchParams.append("sort", `${sortDirection === 'desc' ? '-' : ''}${sort}`);
  
  // Build the query string for filtering
  let queryString = '';
  
  if (query) {
    queryString += `name:*${query}*`;
  }
  
  if (countryCode) {
    queryString += queryString ? ` AND country_code:${countryCode}` : `country_code:${countryCode}`;
  }
  
  if (populationMin) {
    queryString += queryString ? ` AND population>=${populationMin}` : `population>=${populationMin}`;
  }
  
  if (timezone) {
    queryString += queryString ? ` AND timezone:${timezone}` : `timezone:${timezone}`;
  }
  
  if (queryString) {
    searchParams.append("q", queryString);
  }
  
  // Make the API request
  const response = await fetch(`${GEONAMES_API_URL}?${searchParams.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Geonames API error: ${response.status} ${response.statusText}`);
  }
  
  const data: GeonamesResponse = await response.json();
  
  // Map the response to our City type
  const cities = data.records.map(mapRecordToCity);
  
  return {
    cities,
    total: data.nhits,
    hasMore: offset + cities.length < data.nhits
  };
}

// Get a city by name
export async function getCityByName(name: string): Promise<City | null> {
  try {
    const searchParams = new URLSearchParams();
    searchParams.append("dataset", DATASET);
    searchParams.append("q", `name:"${name}"`);
    searchParams.append("rows", "1");
    
    const response = await fetch(`${GEONAMES_API_URL}?${searchParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Geonames API error: ${response.status} ${response.statusText}`);
    }
    
    const data: GeonamesResponse = await response.json();
    
    if (data.records.length === 0) {
      return null;
    }
    
    return mapRecordToCity(data.records[0]);
  } catch (error) {
    console.error("Error fetching city by name:", error);
    return null;
  }
}

// Get autocomplete suggestions for city names
export async function getCitiesAutocomplete(query: string): Promise<AutocompleteSuggestion[]> {
  if (!query || query.length < 2) {
    return [];
  }
  
  try {
    const searchParams = new URLSearchParams();
    searchParams.append("dataset", DATASET);
    searchParams.append("q", `name:*${query}*`);
    searchParams.append("rows", "5");
    searchParams.append("sort", "population");
    
    const response = await fetch(`${GEONAMES_API_URL}?${searchParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Geonames API error: ${response.status} ${response.statusText}`);
    }
    
    const data: GeonamesResponse = await response.json();
    
    return data.records.map(record => ({
      id: record.recordid,
      name: record.fields.name,
      country: record.fields.cou_name_en
    }));
  } catch (error) {
    console.error("Error fetching autocomplete suggestions:", error);
    return [];
  }
}

// Get a city near specified coordinates
export async function getNearbyCity(lat: number, lon: number): Promise<City | null> {
  try {
    console.log(`Finding city near coordinates: lat=${lat}, lon=${lon}`);
    
    // Try with a smaller radius first (10km)
    let city = await findNearbyCity(lat, lon, 10000);
    
    // If not found, try with a medium radius (50km)
    if (!city) {
      console.log("No city found within 10km, trying 50km radius");
      city = await findNearbyCity(lat, lon, 50000);
    }
    
    // If still not found, try with a larger radius (100km)
    if (!city) {
      console.log("No city found within 50km, trying 100km radius");
      city = await findNearbyCity(lat, lon, 100000);
    }
    
    // If still not found, try a final attempt with 200km and less restrictive parameters
    if (!city) {
      console.log("No city found within 100km, trying 200km radius with less strict parameters");
      city = await findNearbyCity(lat, lon, 200000, 5);
    }
    
    if (city) {
      console.log(`Found nearby city: ${city.name} (${city.country_code})`);
    } else {
      console.log("Could not find any nearby city after multiple attempts");
    }
    
    return city;
  } catch (error) {
    console.error("Error fetching nearby city:", error);
    return null;
  }
}

// Helper function to find nearby cities with a specified radius
async function findNearbyCity(lat: number, lon: number, radiusMeters: number, rows: number = 1): Promise<City | null> {
  try {
    const searchParams = new URLSearchParams();
    searchParams.append("dataset", DATASET);
    searchParams.append("geofilter.distance", `${lat},${lon},${radiusMeters}`);
    searchParams.append("rows", rows.toString());
    searchParams.append("sort", "-population");
    
    const response = await fetch(`${GEONAMES_API_URL}?${searchParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Geonames API error: ${response.status} ${response.statusText}`);
    }
    
    const data: GeonamesResponse = await response.json();
    
    if (data.records.length === 0) {
      return null;
    }
    
    return mapRecordToCity(data.records[0]);
  } catch (error) {
    console.error(`Error fetching nearby city with radius ${radiusMeters}m:`, error);
    return null;
  }
}

// Search cities with a more flexible search
export async function searchCities(query: string, limit = 10): Promise<City[]> {
  try {
    const searchParams = new URLSearchParams();
    searchParams.append("dataset", DATASET);
    searchParams.append("q", query);
    searchParams.append("rows", limit.toString());
    
    const response = await fetch(`${GEONAMES_API_URL}?${searchParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Geonames API error: ${response.status} ${response.statusText}`);
    }
    
    const data: GeonamesResponse = await response.json();
    
    return data.records.map(mapRecordToCity);
  } catch (error) {
    console.error("Error searching cities:", error);
    return [];
  }
}
