export interface CurrentWeather {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  clouds: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  rain?: {
    "1h"?: number;
    "3h"?: number;
  };
  snow?: {
    "1h"?: number;
    "3h"?: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  rain?: {
    "3h"?: number;
  };
  snow?: {
    "3h"?: number;
  };
  dt_txt: string;
  pop: number; // Probability of precipitation
}

export interface ForecastResponse {
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface DailyForecast {
  date: string;
  temp_max: number;
  temp_min: number;
  description: string;
  icon: string;
  precipitation: number; // Probability in percentage
}

export interface HourlyForecast {
  time: string;
  temp: number;
  icon: string;
  description: string;
}

export type WeatherUnit = 'metric' | 'imperial';
