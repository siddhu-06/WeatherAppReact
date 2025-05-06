import { useQuery } from "@tanstack/react-query";
import { useWeatherContext } from "@/context/WeatherContext";
import { CurrentWeather, ForecastResponse, DailyForecast, HourlyForecast } from "@/types/weather";
import { groupForecastByDay, mapToHourlyForecast } from "@/lib/weatherUtils";

export function useCurrentWeather(lat: string, lon: string) {
  const { unit } = useWeatherContext();
  
  return useQuery<CurrentWeather>({
    queryKey: ['/api/weather/current', lat, lon, unit],
    queryFn: async () => {
      if (!lat || !lon) {
        throw new Error('Missing coordinates');
      }
      console.log('Requesting weather with coordinates:', { lat, lon, unit });
      const url = `/api/weather/current?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&units=${unit}`;
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch weather data');
      }
      return response.json();
    },
    enabled: !!lat && !!lon,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useForecast(lat: string, lon: string) {
  const { unit } = useWeatherContext();
  
  const forecastQuery = useQuery<ForecastResponse>({
    queryKey: ['/api/weather/forecast', lat, lon, unit],
    queryFn: async () => {
      if (!lat || !lon) {
        throw new Error('Missing coordinates');
      }
      console.log('Requesting forecast with coordinates:', { lat, lon, unit });
      const url = `/api/weather/forecast?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&units=${unit}`;
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch forecast data');
      }
      return response.json();
    },
    enabled: !!lat && !!lon,
    staleTime: 30 * 60 * 1000, // 30 minutes
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
