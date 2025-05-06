import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useAutocomplete } from "@/hooks/useCity";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { AutocompleteSuggestion } from "@/types/city";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterToggle: () => void;
}

export default function SearchBar({ onSearch, onFilterToggle }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const autocompleteRef = useRef<HTMLDivElement>(null);
  
  const { data: suggestions, isLoading } = useAutocomplete(debouncedQuery);
  
  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Click outside to close autocomplete
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowAutocomplete(e.target.value.length > 1);
    onSearch(e.target.value);
  };
  
  const handleSuggestionSelect = (suggestion: AutocompleteSuggestion) => {
    setSearchQuery(suggestion.name);
    setShowAutocomplete(false);
    onSearch(suggestion.name);
  };
  
  const handleViewWeather = (suggestion: AutocompleteSuggestion) => {
    navigate(`/weather/${encodeURIComponent(suggestion.name)}`);
  };
  
  const getCurrentLocation = () => {
    // Show loading toast
    const { id: loadingToastId } = toast({
      title: "Detecting Location",
      description: "Please allow location access if prompted...",
      duration: 10000,
    });

    if (!navigator.geolocation) {
      // Dismiss loading toast
      toast.dismiss(loadingToastId);
      
      // Show error toast
      toast({
        title: "Browser Error",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
        duration: 5000
      });
      return;
    }

    // Options for better geolocation accuracy
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Dismiss loading toast
          toast.dismiss(loadingToastId);
          
          // Show progress toast
          const { id: progressToastId } = toast({
            title: "Finding Nearby City",
            description: "Searching for the closest city to your location...",
            duration: 10000,
          });

          const { latitude, longitude } = position.coords;
          console.log(`Got coordinates: lat=${latitude}, lon=${longitude}`);
          
          // Make API request to find nearby city
          const response = await fetch(`/api/cities/nearby?lat=${latitude}&lon=${longitude}`);
          
          // Dismiss progress toast
          toast.dismiss(progressToastId);

          if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
          }
          
          const city = await response.json();
          
          if (city?.name) {
            // Success: Navigate to the city's weather page
            navigate(`/weather/${encodeURIComponent(city.name)}`);
            
            toast({
              title: "Location Found",
              description: `Showing weather for ${city.name}, ${city.cou_name_en}`,
              duration: 3000,
            });
          } else {
            console.error("No city found near coordinates", { latitude, longitude });
            
            // Dispatch a custom event to show the location error modal
            const locationErrorEvent = new Event('location-error');
            window.dispatchEvent(locationErrorEvent);
            
            // Also show a toast for immediate feedback
            toast({
              title: "Location Error",
              description: "Couldn't find a city near your location.",
              variant: "destructive",
              duration: 5000
            });
          }
        } catch (error) {
          console.error("Error in geolocation processing:", error);
          
          // Dispatch a custom event to show the location error modal
          const locationErrorEvent = new Event('location-error');
          window.dispatchEvent(locationErrorEvent);
          
          toast({
            title: "Location Error",
            description: "Failed to find a city near your location. Please try again or search manually.",
            variant: "destructive",
            duration: 5000
          });
        }
      },
      (error) => {
        // Dismiss loading toast
        toast.dismiss(loadingToastId);
        
        console.error("Geolocation error:", error.code, error.message);
        
        // Dispatch a custom event to show the location error modal
        const locationErrorEvent = new Event('location-error');
        window.dispatchEvent(locationErrorEvent);
        
        // Show appropriate error message based on the error code
        let errorMessage = "Couldn't access your location.";
        
        switch(error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = "Location access was denied. Please enable location permissions in your browser settings.";
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage = "Your location could not be determined. Please try again later.";
            break;
          case 3: // TIMEOUT
            errorMessage = "Location request timed out. Please try again.";
            break;
        }
        
        toast({
          title: "Geolocation Error",
          description: errorMessage,
          variant: "destructive",
          duration: 5000
        });
      },
      options
    );
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <div className="relative flex-grow" ref={autocompleteRef}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="material-icons text-neutral-400">search</span>
        </div>
        <Input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary"
          placeholder="Search cities as you type..."
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => searchQuery.length > 1 && setShowAutocomplete(true)}
        />
        
        {/* Only show autocomplete dropdown if we actually have suggestions */}
        {showAutocomplete && suggestions && suggestions.length > 0 && !isLoading && (
          <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-lg border border-neutral-200">
            {suggestions.map(suggestion => (
              <div 
                key={suggestion.id} 
                className="autocomplete-item px-4 py-2 cursor-pointer border-b border-neutral-100 hover:bg-gray-50"
                onClick={() => handleSuggestionSelect(suggestion)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleViewWeather(suggestion);
                }}
              >
                <div className="font-medium">{suggestion.name}</div>
                <div className="text-sm text-neutral-400">{suggestion.country}</div>
              </div>
            ))}
          </div>
        )}
        
        {/* "No cities found" is shown in the table instead */}
      </div>
      
      <div className="flex gap-2">
        <Button 
          className="flex items-center justify-center"
          onClick={onFilterToggle}
        >
          <span className="material-icons mr-1">filter_list</span>
          <span>Filters</span>
        </Button>
        <Button 
          variant="outline"
          className="flex items-center justify-center"
          onClick={getCurrentLocation}
        >
          <span className="material-icons mr-1">my_location</span>
          <span>My Location</span>
        </Button>
      </div>
    </div>
  );
}
