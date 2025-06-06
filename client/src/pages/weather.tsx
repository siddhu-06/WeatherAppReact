import { useEffect, useRef } from "react";
import { useLocation, Link } from "wouter";
import { useCurrentWeather, useForecast } from "@/hooks/useWeather";
import { useCity } from "@/hooks/useCity";
import { useWeatherContext } from "@/context/WeatherContext";
import { City } from "@/types/city";
import { Button } from "@/components/ui/button";
import CurrentWeatherCard from "@/components/weather/CurrentWeather";
import ForecastSection from "@/components/weather/ForecastSection";
import HourlyForecastSection from "@/components/weather/HourlyForecast";
import CityInfo from "@/components/weather/CityInfo";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

interface WeatherProps {
  params: {
    cityName: string;
  };
}

export default function Weather({ params }: WeatherProps) {
  const { cityName } = params;
  const [, navigate] = useLocation();
  const { unit, setUnit, isFavorite, toggleFavorite, addViewedCity } = useWeatherContext();
  
  // Fetch city data
  const { 
    data: city, 
    isLoading: isCityLoading, 
    isError: isCityError, 
    error: cityError 
  } = useCity(decodeURIComponent(cityName));
  
  // Fetch weather data when we have city coordinates
  const { 
    data: currentWeather,
    isLoading: isCurrentLoading,
    isError: isCurrentError,
    error: currentError
  } = useCurrentWeather(
    city?.coordinates?.lat || "", 
    city?.coordinates?.lon || ""
  );
  
  // Fetch forecast data
  const {
    dailyForecast,
    hourlyForecast,
    isLoading: isForecastLoading,
    isError: isForecastError,
    error: forecastError
  } = useForecast(
    city?.coordinates?.lat || "", 
    city?.coordinates?.lon || ""
  );
  
  // Use a ref to track whether we've already added this city to viewed cities
  const processedCityRef = useRef<string | null>(null);
  
  // Store viewed city data in context when we have both city and weather data
  useEffect(() => {
    // Only proceed if we have all the data we need
    if (!city?.id || !currentWeather?.main || !currentWeather?.weather?.[0]) {
      return;
    }
    
    // Create a unique identifier for this city+weather combination
    const cityWeatherId = `${city.id}-${currentWeather.dt}`;
    
    // Only add to viewed cities if we haven't processed this combination yet
    if (processedCityRef.current !== cityWeatherId) {
      processedCityRef.current = cityWeatherId;
      
      // Create the weather summary to store with the city
      const weatherSummary = {
        temp_max: currentWeather.main.temp_max,
        temp_min: currentWeather.main.temp_min,
        icon: currentWeather.weather[0].icon
      };
      
      // Process this city only once with a timeout to avoid re-renders
      setTimeout(() => {
        const cityWithWeather: City = {
          id: city.id,
          name: city.name,
          ascii_name: city.ascii_name,
          country_code: city.country_code,
          cou_name_en: city.cou_name_en,
          population: city.population,
          timezone: city.timezone,
          coordinates: { ...city.coordinates },
          weather: weatherSummary,
          alternate_names: city.alternate_names || [],
          lastViewed: Date.now() // Add timestamp for history tracking
        };
        
        addViewedCity(cityWithWeather);
      }, 0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // Use the minimum dependencies needed
    currentWeather?.dt
  ]);
  
  // Handle loading states
  if (isCityLoading) {
    return <LoadingState message="Loading city information..." />;
  }
  
  // Handle error states
  if (isCityError) {
    return (
      <ErrorState 
        message={`Error loading city: ${cityError instanceof Error ? cityError.message : 'Unknown error'}`}
        onRetry={() => navigate("/")}
      />
    );
  }
  
  // If we don't have city data
  if (!city || !city.id || !city.coordinates) {
    return (
      <ErrorState 
        message="City not found or missing data. Please try another search."
        onRetry={() => navigate("/")}
      />
    );
  }
  
  return (
    <div id="weather-view" className="weather-view fade-in">
      {/* Back Navigation */}
      <div className="mb-4">
        <Link href="/" className="flex items-center text-primary hover:text-primary/80 transition">
          <span className="material-icons">arrow_back</span>
          <span className="ml-1">Back to Cities</span>
        </Link>
      </div>
      
      {/* City Header with Favorite Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-neutral-700">{city.name}</h2>
          <p className="text-neutral-400">{city.cou_name_en}</p>
        </div>
        <Button 
          variant="ghost"
          className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-neutral-100 transition"
          onClick={() => toggleFavorite(city.id)}
        >
          <span className="material-icons text-red-500">
            {isFavorite(city.id) ? 'favorite' : 'favorite_border'}
          </span>
        </Button>
      </div>
      
      {/* Current Weather */}
      {isCurrentLoading ? (
        <LoadingState message="Loading weather data..." />
      ) : isCurrentError ? (
        <div className="mb-6">
          <ErrorState 
            title="Error Loading Weather"
            message={
              currentError instanceof Error 
                ? currentError.message.includes('Rate limited')
                  ? 'Weather API rate limit reached. Please try again in a few moments.'
                  : currentError.message.includes('401')
                    ? 'Weather API authentication error. This might be due to an API key issue.'
                    : 'There was an error loading the current weather data.'
                : 'There was an error loading the current weather data.'
            }
            onRetry={() => window.location.reload()}
          />
        </div>
      ) : currentWeather ? (
        <CurrentWeatherCard data={currentWeather} />
      ) : null}
      
      {/* 5-Day Forecast */}
      {isForecastLoading ? (
        <LoadingState message="Loading forecast data..." />
      ) : isForecastError ? (
        <div className="mb-6">
          <ErrorState 
            title="Error Loading Forecast"
            message={
              forecastError instanceof Error 
                ? forecastError.message.includes('Rate limited')
                  ? 'Forecast API rate limit reached. Please try again in a few moments.'
                  : forecastError.message.includes('401')
                    ? 'Forecast API authentication error. This might be due to an API key issue.'
                    : 'There was an error loading the forecast data.'
                : 'There was an error loading the forecast data.'
            }
            onRetry={() => window.location.reload()}
          />
        </div>
      ) : dailyForecast.length > 0 ? (
        <ForecastSection forecast={dailyForecast} />
      ) : null}
      
      {/* Hourly Forecast */}
      {isForecastLoading ? null : isForecastError ? null : hourlyForecast.length > 0 ? (
        <HourlyForecastSection hourlyData={hourlyForecast} />
      ) : null}
      
      {/* City Information and Map */}
      <CityInfo city={city} />
    </div>
  );
}
