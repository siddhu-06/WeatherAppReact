import { useQuery } from "@tanstack/react-query";
import { useWeatherContext } from "@/context/WeatherContext";
import { useToast } from "@/hooks/use-toast";
import { CurrentWeather, ForecastResponse, DailyForecast, HourlyForecast } from "@/types/weather";
import { groupForecastByDay, mapToHourlyForecast } from "@/lib/weatherUtils";

// Helper function to handle API errors
async function handleApiResponse<T>(response: Response, errorPrefix: string): Promise<T> {
  if (response.ok) {
    return response.json();
  }
  
  try {
    const errorData = await response.json();
    
    // Handle rate limiting (429) errors
    if (response.status === 429) {
      throw new Error(`Rate limited: ${errorData.message || 'Too many requests. Please try again later.'}`);
    }
    
    throw new Error(`${errorPrefix}: ${errorData.message || `HTTP error ${response.status}`}`);
  } catch (e) {
    if (e instanceof Error) {
      throw e;
    }
    throw new Error(`${errorPrefix}: ${response.statusText || 'Unknown error'}`);
  }
}

export function useCurrentWeather(lat: string, lon: string) {
  const { unit } = useWeatherContext();
  const { toast } = useToast();
  
  return useQuery<CurrentWeather>({
    queryKey: ['/api/weather/current', lat, lon, unit],
    queryFn: async () => {
      if (!lat || !lon) {
        throw new Error('Missing coordinates');
      }
      
      console.log('Requesting weather with coordinates:', { lat, lon, unit: unit });
      const url = `/api/weather/current?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&units=${unit}`;
      
      try {
        const response = await fetch(url);
        return handleApiResponse<CurrentWeather>(response, 'Weather data error');
      } catch (error) {
        if (error instanceof Error && error.message.includes('Rate limited')) {
          toast({
            title: "API Rate Limit Reached",
            description: "Weather data is temporarily unavailable. Please try again in a minute.",
            variant: "destructive"
          });
        }
        throw error;
      }
    },
    enabled: !!lat && !!lon,
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: (failureCount, error) => {
      // Don't retry rate limit errors, but retry other errors up to 3 times
      if (error instanceof Error && error.message.includes('Rate limited')) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

export function useForecast(lat: string, lon: string) {
  const { unit } = useWeatherContext();
  const { toast } = useToast();
  
  const forecastQuery = useQuery<ForecastResponse>({
    queryKey: ['/api/weather/forecast', lat, lon, unit],
    queryFn: async () => {
      if (!lat || !lon) {
        throw new Error('Missing coordinates');
      }
      
      console.log('Requesting forecast with coordinates:', { lat, lon, unit: unit });
      const url = `/api/weather/forecast?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&units=${unit}`;
      
      try {
        const response = await fetch(url);
        return handleApiResponse<ForecastResponse>(response, 'Forecast data error');
      } catch (error) {
        if (error instanceof Error && error.message.includes('Rate limited')) {
          toast({
            title: "API Rate Limit Reached",
            description: "Forecast data is temporarily unavailable. Please try again in a minute.",
            variant: "destructive"
          });
        }
        throw error;
      }
    },
    enabled: !!lat && !!lon,
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: (failureCount, error) => {
      // Don't retry rate limit errors, but retry other errors up to 3 times
      if (error instanceof Error && error.message.includes('Rate limited')) {
        return false;
      }
      return failureCount < 3;
    },
  });
  
  // Process the forecast data into daily and hourly formats
  const dailyForecast: DailyForecast[] = forecastQuery.data 
    ? groupForecastByDay(forecastQuery.data.list)
    : [];
    
  const hourlyForecast: HourlyForecast[] = forecastQuery.data
    ? mapToHourlyForecast(forecastQuery.data.list.slice(0, 12))
    : [];
    
  return {
    ...forecastQuery,
    dailyForecast,
    hourlyForecast,
  };
}
