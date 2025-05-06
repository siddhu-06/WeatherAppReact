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
  const { favorites, unit, setUnit } = useWeatherContext();
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
          <div className="flex space-x-4">
            <Button 
              variant="ghost" 
              className="hover:bg-white/10 px-3 py-1 rounded transition"
              onClick={toggleDarkMode}
            >
              <span className="material-icons">dark_mode</span>
            </Button>
            
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
                {favorites.length > 0 ? (
                  favorites.map(cityId => (
                    <DropdownMenuItem key={cityId}>
                      <Link href={`/weather/${cityId}`} className="w-full">
                        {cityId}
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
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="hover:bg-white/10 px-3 py-1 rounded transition"
                >
                  <span className="material-icons">settings</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setUnit('metric')}>
                  <span className={unit === 'metric' ? 'font-bold' : ''}>°C Metric</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUnit('imperial')}>
                  <span className={unit === 'imperial' ? 'font-bold' : ''}>°F Imperial</span>
                </DropdownMenuItem>
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
                  
                  <div className="border-t pt-2">
                    <p className="font-medium mb-2">Favorites</p>
                    {favorites.length > 0 ? (
                      <div className="space-y-2">
                        {favorites.map(cityId => (
                          <Link key={cityId} href={`/weather/${cityId}`} className="block px-2 py-1 hover:bg-gray-100 rounded">
                            {cityId}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No favorites yet</p>
                    )}
                  </div>
                  
                  <div className="border-t pt-2">
                    <p className="font-medium mb-2">Units</p>
                    <Button 
                      variant={unit === 'metric' ? 'default' : 'outline'} 
                      size="sm"
                      className="mr-2"
                      onClick={() => setUnit('metric')}
                    >
                      °C Metric
                    </Button>
                    <Button 
                      variant={unit === 'imperial' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setUnit('imperial')}
                    >
                      °F Imperial
                    </Button>
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
