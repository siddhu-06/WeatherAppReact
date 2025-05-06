import { createContext, useContext, useState, ReactNode } from "react";
import { City } from "@/types/city";
import { WeatherUnit } from "@/types/weather";

interface WeatherContextType {
  viewedCities: Record<string, City>;
  addViewedCity: (city: City) => void;
  favorites: string[];
  toggleFavorite: (cityId: string) => void;
  isFavorite: (cityId: string) => boolean;
  unit: WeatherUnit;
  setUnit: (unit: WeatherUnit) => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [viewedCities, setViewedCities] = useState<Record<string, City>>({});
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("favoritesCities");
    return saved ? JSON.parse(saved) : [];
  });
  const [unit, setUnit] = useState<WeatherUnit>(() => {
    const saved = localStorage.getItem("weatherUnit");
    return (saved as WeatherUnit) || "metric";
  });

  const addViewedCity = (city: City) => {
    setViewedCities(prev => ({
      ...prev,
      [city.id]: city
    }));
  };

  const toggleFavorite = (cityId: string) => {
    const newFavorites = favorites.includes(cityId)
      ? favorites.filter(id => id !== cityId)
      : [...favorites, cityId];
    
    setFavorites(newFavorites);
    localStorage.setItem("favoritesCities", JSON.stringify(newFavorites));
  };

  const isFavorite = (cityId: string) => favorites.includes(cityId);

  const handleSetUnit = (newUnit: WeatherUnit) => {
    setUnit(newUnit);
    localStorage.setItem("weatherUnit", newUnit);
  };

  return (
    <WeatherContext.Provider
      value={{
        viewedCities,
        addViewedCity,
        favorites,
        toggleFavorite,
        isFavorite,
        unit,
        setUnit: handleSetUnit
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeatherContext() {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error("useWeatherContext must be used within a WeatherProvider");
  }
  return context;
}
