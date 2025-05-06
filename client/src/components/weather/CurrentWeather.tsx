import { useWeatherContext } from "@/context/WeatherContext";
import { CurrentWeather as CurrentWeatherType } from "@/types/weather";
import { getWeatherIcon, getWeatherBackground, formatTemperature, formatTime } from "@/lib/weatherUtils";

interface CurrentWeatherCardProps {
  data: CurrentWeatherType;
}

export default function CurrentWeatherCard({ data }: CurrentWeatherCardProps) {
  const { unit } = useWeatherContext();
  
  if (!data) return null;
  
  // Get the appropriate background class based on the weather condition
  const backgroundClass = data.weather?.[0]?.icon 
    ? getWeatherBackground(data.weather[0].icon) 
    : 'bg-weather-clear';
    
  const weatherIcon = data.weather?.[0]?.icon 
    ? getWeatherIcon(data.weather[0].icon) 
    : 'wb_sunny';
    
  const description = data.weather?.[0]?.description 
    ? data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1) 
    : 'Clear Sky';
    
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      {/* Dynamic background based on weather */}
      <div className={`${backgroundClass} p-6 text-white`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="material-icons weather-icon">{weatherIcon}</span>
            <div className="ml-4">
              <div className="text-4xl font-semibold font-mono">
                {formatTemperature(data.temp, unit)}
              </div>
              <div className="text-lg">{description}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-white/90">
            <div className="flex items-center">
              <span className="material-icons mr-2">thermostat</span>
              <div>
                <div className="text-sm">Feels Like</div>
                <div className="font-mono">{formatTemperature(data.feels_like, unit)}</div>
              </div>
            </div>
            <div className="flex items-center">
              <span className="material-icons mr-2">water_drop</span>
              <div>
                <div className="text-sm">Humidity</div>
                <div className="font-mono">{data.humidity}%</div>
              </div>
            </div>
            <div className="flex items-center">
              <span className="material-icons mr-2">air</span>
              <div>
                <div className="text-sm">Wind</div>
                <div className="font-mono">
                  {data.wind_speed} {unit === 'metric' ? 'm/s' : 'mph'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional Weather Details */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-neutral-700 mb-4">Weather Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-neutral-100 p-4 rounded-lg">
            <div className="text-sm text-neutral-400">Pressure</div>
            <div className="text-lg font-mono">{data.pressure} hPa</div>
          </div>
          <div className="bg-neutral-100 p-4 rounded-lg">
            <div className="text-sm text-neutral-400">Visibility</div>
            <div className="text-lg font-mono">{(data.visibility / 1000).toFixed(1)} km</div>
          </div>
          <div className="bg-neutral-100 p-4 rounded-lg">
            <div className="text-sm text-neutral-400">Sunrise</div>
            <div className="text-lg font-mono">{formatTime(data.sys.sunrise)}</div>
          </div>
          <div className="bg-neutral-100 p-4 rounded-lg">
            <div className="text-sm text-neutral-400">Sunset</div>
            <div className="text-lg font-mono">{formatTime(data.sys.sunset)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
