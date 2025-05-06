import { HourlyForecast } from "@/types/weather";
import { useWeatherContext } from "@/context/WeatherContext";
import { getWeatherIcon, formatTemperature } from "@/lib/weatherUtils";

interface HourlyForecastProps {
  hourlyData: HourlyForecast[];
}

export default function HourlyForecastSection({ hourlyData }: HourlyForecastProps) {
  const { unit } = useWeatherContext();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-medium text-neutral-700 mb-4">Hourly Forecast</h3>
      <div className="overflow-x-auto">
        <div className="min-w-max grid grid-cols-12 gap-2">
          {hourlyData.map((hour, index) => (
            <div key={index} className="flex flex-col items-center p-2">
              <div className="text-sm text-neutral-400">
                {index === 0 ? "Now" : hour.time}
              </div>
              <div className="my-2">
                <span className="material-icons text-weather-clear">{getWeatherIcon(hour.icon)}</span>
              </div>
              <div className="font-mono font-medium">{formatTemperature(hour.temp, unit)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
