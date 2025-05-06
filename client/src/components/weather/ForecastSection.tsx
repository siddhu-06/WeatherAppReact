import { DailyForecast } from "@/types/weather";
import { useWeatherContext } from "@/context/WeatherContext";
import { getWeatherIcon, formatTemperature, formatDate } from "@/lib/weatherUtils";

interface ForecastSectionProps {
  forecast: DailyForecast[];
}

export default function ForecastSection({ forecast }: ForecastSectionProps) {
  const { unit } = useWeatherContext();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-medium text-neutral-700 mb-4">5-Day Forecast</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {forecast.map((day, index) => (
          <div key={index} className="bg-neutral-100 p-4 rounded-lg">
            <div className="text-center mb-2 font-medium">{formatDate(new Date(day.date).getTime() / 1000)}</div>
            <div className="flex justify-center mb-3">
              <span className="material-icons text-weather-clear">{getWeatherIcon(day.icon)}</span>
            </div>
            <div className="text-center mb-2 font-mono">
              <span className="text-lg font-medium">{formatTemperature(day.temp_max, unit)}</span>
              <span className="text-sm text-neutral-400 ml-2">{formatTemperature(day.temp_min, unit)}</span>
            </div>
            <div className="text-center text-sm text-neutral-600">
              {day.description.charAt(0).toUpperCase() + day.description.slice(1)}
            </div>
            <div className="text-center text-sm text-neutral-400 mt-1">
              <span className="flex items-center justify-center">
                <span className="material-icons text-xs mr-1">water_drop</span>
                <span>{Math.round(day.precipitation)}%</span>
              </span>
            </div>
            <div className="mt-2">
              <div className="temperature-bar w-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
