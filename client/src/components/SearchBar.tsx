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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(`/api/cities/nearby?lat=${latitude}&lon=${longitude}`);
            const city = await response.json();
            
            if (city?.name) {
              navigate(`/weather/${encodeURIComponent(city.name)}`);
              toast({
                title: "Location Found",
                description: `Showing weather for ${city.name}`,
              });
            } else {
              // Dispatch a custom event to show the location error modal
              const locationErrorEvent = new Event('location-error');
              window.dispatchEvent(locationErrorEvent);
              
              // Also show a toast for immediate feedback
              toast({
                title: "Location Error",
                description: "Couldn't find a city near your location.",
                variant: "destructive"
              });
            }
          } catch (error) {
            toast({
              title: "Location Error",
              description: (
                <div className="flex flex-col gap-2">
                  <p>Error finding city near your location.</p>
                  <p className="text-xs">This could be due to:</p>
                  <ul className="text-xs list-disc pl-4">
                    <li>Network connection issues</li>
                    <li>Server API limitations</li>
                    <li>Temporary service unavailability</li>
                  </ul>
                  <p className="text-xs mt-1">Please try again later or search manually.</p>
                </div>
              ),
              variant: "destructive",
              duration: 8000
            });
          }
        },
        (error) => {
          // Dispatch a custom event to show the location error modal
          const locationErrorEvent = new Event('location-error');
          window.dispatchEvent(locationErrorEvent);
          
          // Also show a toast for immediate feedback
          toast({
            title: "Geolocation Error",
            description: "Couldn't access your location.",
            variant: "destructive"
          });
        }
      );
    } else {
      toast({
        title: "Browser Error",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive"
      });
    }
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
