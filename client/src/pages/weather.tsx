import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useCurrentWeather, useForecast } from "@/hooks/useWeather";
import { useCity } from "@/hooks/useCity";
import { useWeatherContext } from "@/context/WeatherContext";
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
    city?.coordinates ? Number(city.coordinates.lat) : 0, 
    city?.coordinates ? Number(city.coordinates.lon) : 0
  );
  
  // Fetch forecast data
  const {
    dailyForecast,
    hourlyForecast,
    isLoading: isForecastLoading,
    isError: isForecastError,
    error: forecastError
  } = useForecast(
    city?.coordinates ? Number(city.coordinates.lat) : 0, 
    city?.coordinates ? Number(city.coordinates.lon) : 0
  );
  
  // Store viewed city data in context when we have both city and weather data
  useEffect(() => {
    if (city && currentWeather) {
      // Create a weather summary for the city table
      const weatherSummary = {
        temp_max: currentWeather.main?.temp_max,
        temp_min: currentWeather.main?.temp_min,
        icon: currentWeather.weather?.[0]?.icon
      };
      
      // Add to viewed cities
      addViewedCity({
        ...city,
        weather: weatherSummary
      });
    }
  }, [city, currentWeather, addViewedCity]);
  
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
  if (!city) {
    return (
      <ErrorState 
        message="City not found. Please try another search."
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
        <ErrorState 
          message={`Error loading weather data: ${currentError instanceof Error ? currentError.message : 'Unknown error'}`}
        />
      ) : currentWeather ? (
        <CurrentWeatherCard data={currentWeather} />
      ) : null}
      
      {/* 5-Day Forecast */}
      {isForecastLoading ? (
        <LoadingState message="Loading forecast data..." />
      ) : isForecastError ? (
        <ErrorState 
          message={`Error loading forecast data: ${forecastError instanceof Error ? forecastError.message : 'Unknown error'}`}
        />
      ) : dailyForecast.length > 0 ? (
        <ForecastSection forecast={dailyForecast} />
      ) : null}
      
      {/* Hourly Forecast */}
      {isForecastLoading ? null : isForecastError ? null : hourlyForecast.length > 0 ? (
        <HourlyForecastSection hourlyData={hourlyForecast} />
      ) : null}
      
      {/* City Information and Map */}
      <CityInfo city={city} />
      
      {/* Unit Switch */}
      <div className="flex justify-end mb-6">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <Button
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              unit === 'metric' ? 'bg-primary text-white' : 'bg-white text-neutral-700'
            }`}
            onClick={() => setUnit('metric')}
          >
            °C
          </Button>
          <Button
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              unit === 'imperial' ? 'bg-primary text-white' : 'bg-white text-neutral-700'
            }`}
            onClick={() => setUnit('imperial')}
          >
            °F
          </Button>
        </div>
      </div>
    </div>
  );
}
