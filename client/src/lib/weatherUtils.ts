import { ForecastItem, DailyForecast, HourlyForecast, WeatherUnit } from "@/types/weather";

export function getWeatherIcon(iconCode: string): string {
  const iconMap: Record<string, string> = {
    '01d': 'wb_sunny',       // clear sky (day)
    '01n': 'nights_stay',    // clear sky (night)
    '02d': 'partly_cloudy_day', // few clouds (day)
    '02n': 'nights_stay',    // few clouds (night)
    '03d': 'cloud',          // scattered clouds
    '03n': 'cloud',
    '04d': 'cloud',          // broken clouds
    '04n': 'cloud',
    '09d': 'grain',          // shower rain
    '09n': 'grain',
    '10d': 'rainy',          // rain
    '10n': 'rainy',
    '11d': 'flash_on',       // thunderstorm
    '11n': 'flash_on',
    '13d': 'ac_unit',        // snow
    '13n': 'ac_unit',
    '50d': 'blur_on',        // mist
    '50n': 'blur_on',
  };
  
  return iconMap[iconCode] || 'help_outline';
}

export function getWeatherBackground(iconCode: string): string {
  if (iconCode.startsWith('01') || iconCode.startsWith('02')) {
    return 'bg-weather-clear';
  } else if (iconCode.startsWith('03') || iconCode.startsWith('04')) {
    return 'bg-weather-cloudy';
  } else if (iconCode.startsWith('09') || iconCode.startsWith('10') || iconCode.startsWith('50')) {
    return 'bg-weather-rainy';
  } else if (iconCode.startsWith('11') || iconCode.startsWith('13')) {
    return 'bg-weather-stormy';
  }
  return 'bg-weather-clear'; // Default
}

export function getWeatherTextColor(iconCode: string): string {
  if (iconCode.startsWith('01') || iconCode.startsWith('02')) {
    return 'text-weather-clear';
  } else if (iconCode.startsWith('03') || iconCode.startsWith('04')) {
    return 'text-weather-cloudy';
  } else if (iconCode.startsWith('09') || iconCode.startsWith('10') || iconCode.startsWith('50')) {
    return 'text-weather-rainy';
  } else if (iconCode.startsWith('11') || iconCode.startsWith('13')) {
    return 'text-weather-stormy';
  }
  return 'text-weather-clear'; // Default
}

export function formatTemperature(temp: number, unit: WeatherUnit): string {
  const symbol = unit === 'metric' ? '°C' : '°F';
  return `${Math.round(temp)}${symbol}`;
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export function formatDay(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function formatHour(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
}

export function groupForecastByDay(forecastList: ForecastItem[]): DailyForecast[] {
  const dailyData: Record<string, ForecastItem[]> = {};
  
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    dailyData[date] = dailyData[date] || [];
    dailyData[date].push(item);
  });
  
  return Object.entries(dailyData).map(([date, items]) => {
    const maxTemp = Math.max(...items.map(item => item.main.temp_max));
    const minTemp = Math.min(...items.map(item => item.main.temp_min));
    const dayItem = items.find(item => {
      const hour = new Date(item.dt * 1000).getHours();
      return hour >= 12 && hour <= 15; // Use data from around midday
    }) || items[0];
    
    const precipitation = Math.max(...items.map(item => item.pop || 0)) * 100;
    
    return {
      date,
      temp_max: maxTemp,
      temp_min: minTemp,
      description: dayItem.weather[0].description,
      icon: dayItem.weather[0].icon,
      precipitation
    };
  });
}

export function mapToHourlyForecast(forecastList: ForecastItem[]): HourlyForecast[] {
  return forecastList.map(item => ({
    time: formatHour(item.dt),
    temp: item.main.temp,
    icon: item.weather[0].icon,
    description: item.weather[0].description
  }));
}
