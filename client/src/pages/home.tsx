import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import CitiesTable from "@/components/CitiesTable";
import LocationErrorModal from "@/components/LocationErrorModal";
import { CitySearchParams } from "@/types/city";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showLocationError, setShowLocationError] = useState(false);
  const [filters, setFilters] = useState({
    countryCode: "",
    populationMin: null as number | null,
    timezone: "",
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };

  const handleFilter = (newFilters: {
    countryCode: string;
    populationMin: number | null;
    timezone: string;
  }) => {
    setFilters(newFilters);
    setIsFilterPanelOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({
      countryCode: "",
      populationMin: null,
      timezone: "",
    });
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  // Listen for sort events from the table component
  useEffect(() => {
    const handleSortEvent = (e: CustomEvent) => {
      const { field } = e.detail;
      handleSort(field);
    };
    
    window.addEventListener('sort-table', handleSortEvent as EventListener);
    return () => {
      window.removeEventListener('sort-table', handleSortEvent as EventListener);
    };
  }, [sortField, sortDirection]);
  
  // Listen for location error events
  useEffect(() => {
    const handleLocationError = (event: Event) => {
      // Show the error modal regardless of what type of error it is
      setShowLocationError(true);
      
      // We'll let the LocationErrorModal component determine the specific error type
    };
    
    window.addEventListener('location-error', handleLocationError);
    return () => {
      window.removeEventListener('location-error', handleLocationError);
    };
  }, []);

  const searchParams: CitySearchParams = {
    query: searchQuery,
    countryCode: filters.countryCode,
    populationMin: filters.populationMin || undefined,
    timezone: filters.timezone,
    sort: sortField,
    sortDirection,
    limit: 20,
  };

  return (
    <div id="cities-view" className="cities-view fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-neutral-700 mb-4">Cities Directory</h2>
        
        <SearchBar 
          onSearch={handleSearch} 
          onFilterToggle={toggleFilterPanel} 
        />
        
        <FilterPanel 
          isOpen={isFilterPanelOpen} 
          onFilter={handleFilter} 
          onReset={handleResetFilters} 
        />
      </div>
      
      <CitiesTable 
        searchParams={searchParams}
      />
      
      {/* Location Error Modal */}
      {showLocationError && (
        <LocationErrorModal 
          onClose={() => setShowLocationError(false)} 
        />
      )}
    </div>
  );
}
