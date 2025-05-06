import { useState } from "react";
import { Link } from "wouter";
import { useWeatherContext } from "@/context/WeatherContext";
import { useToast } from "@/hooks/use-toast";
import { useMobile } from "@/hooks/use-mobile";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function Header() {
  const isMobile = useMobile();
  const { viewedCities, favorites, unit, setUnit } = useWeatherContext();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    toast({
      title: "Theme Changed",
      description: document.documentElement.classList.contains('dark') 
        ? "Dark mode enabled" 
        : "Light mode enabled",
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Get actual city names from favorites list (instead of just IDs)
  const favoriteCities = favorites.map(id => viewedCities[id]).filter(Boolean);
  
  // Get recently viewed cities for history
  const recentlyViewedCities = Object.values(viewedCities)
    .sort((a, b) => (b.lastViewed || 0) - (a.lastViewed || 0))
    .slice(0, 5);

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="material-icons mr-2">wb_sunny</span>
          <Link href="/" className="text-xl font-semibold">
            Weather Forecast
          </Link>
        </div>
        
        {!isMobile ? (
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              className="hover:bg-white/10 px-3 py-1 rounded transition"
              onClick={toggleDarkMode}
            >
              <span className="material-icons">dark_mode</span>
            </Button>
            
            {/* Temperature Unit Toggles - Direct Buttons */}
            <div className="inline-flex rounded bg-white/10 mx-1">
              <Button 
                variant="ghost"
                size="sm"
                className={`px-3 py-1 rounded-l ${unit === 'metric' ? 'bg-white/20' : ''}`}
                onClick={() => setUnit('metric')}
              >
                °C
              </Button>
              <Button 
                variant="ghost"
                size="sm"
                className={`px-3 py-1 rounded-r ${unit === 'imperial' ? 'bg-white/20' : ''}`}
                onClick={() => setUnit('imperial')}
              >
                °F
              </Button>
            </div>
            
            {/* History Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="hover:bg-white/10 px-3 py-1 rounded transition"
                >
                  <span className="material-icons">history</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="p-2 text-sm font-medium text-gray-500">Recently Viewed</div>
                {recentlyViewedCities.length > 0 ? (
                  recentlyViewedCities.map(city => (
                    <DropdownMenuItem key={city.id}>
                      <Link href={`/weather/${encodeURIComponent(city.name)}`} className="w-full flex items-center">
                        <span className="mr-2">{city.name}</span>
                        <span className="text-xs text-gray-400">{city.cou_name_en}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>
                    No history yet
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Favorites Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="hover:bg-white/10 px-3 py-1 rounded transition"
                >
                  <span className="material-icons">favorite</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="p-2 text-sm font-medium text-gray-500">Favorites</div>
                {favoriteCities.length > 0 ? (
                  favoriteCities.map(city => (
                    <DropdownMenuItem key={city.id}>
                      <Link href={`/weather/${encodeURIComponent(city.name)}`} className="w-full flex items-center">
                        <span className="mr-2">{city.name}</span>
                        <span className="text-xs text-gray-400">{city.cou_name_en}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>
                    No favorites yet
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <>
            <Button 
              variant="ghost" 
              className="md:hidden"
              onClick={toggleMenu}
            >
              <span className="material-icons">menu</span>
            </Button>
            
            {isMenuOpen && (
              <div className="absolute top-16 right-4 bg-white text-gray-800 rounded-lg shadow-lg p-4 z-50">
                <div className="space-y-3">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    onClick={toggleDarkMode}
                  >
                    <span className="material-icons mr-2">dark_mode</span>
                    <span>Toggle Dark Mode</span>
                  </Button>
                  
                  {/* Temperature Units - Mobile */}
                  <div className="border-t pt-2">
                    <p className="font-medium mb-2">Temperature Unit</p>
                    <div className="flex">
                      <Button 
                        variant={unit === 'metric' ? 'default' : 'outline'} 
                        size="sm"
                        className="mr-2"
                        onClick={() => setUnit('metric')}
                      >
                        °C Celsius
                      </Button>
                      <Button 
                        variant={unit === 'imperial' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setUnit('imperial')}
                      >
                        °F Fahrenheit
                      </Button>
                    </div>
                  </div>
                  
                  {/* History - Mobile */}
                  <div className="border-t pt-2">
                    <p className="font-medium mb-2">
                      <span className="material-icons inline-block mr-1 text-sm">history</span>
                      Recently Viewed
                    </p>
                    {recentlyViewedCities.length > 0 ? (
                      <div className="space-y-2">
                        {recentlyViewedCities.map(city => (
                          <Link 
                            key={city.id} 
                            href={`/weather/${encodeURIComponent(city.name)}`} 
                            className="block px-2 py-1 hover:bg-gray-100 rounded"
                          >
                            {city.name}, {city.cou_name_en}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No history yet</p>
                    )}
                  </div>
                  
                  {/* Favorites - Mobile */}
                  <div className="border-t pt-2">
                    <p className="font-medium mb-2">
                      <span className="material-icons inline-block mr-1 text-sm">favorite</span>
                      Favorites
                    </p>
                    {favoriteCities.length > 0 ? (
                      <div className="space-y-2">
                        {favoriteCities.map(city => (
                          <Link 
                            key={city.id} 
                            href={`/weather/${encodeURIComponent(city.name)}`} 
                            className="block px-2 py-1 hover:bg-gray-100 rounded"
                          >
                            {city.name}, {city.cou_name_en}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No favorites yet</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
}
