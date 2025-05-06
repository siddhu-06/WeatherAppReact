import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { useCitiesSearch } from "@/hooks/useCity";
import { City, CitySearchParams } from "@/types/city";
import { useWeatherContext } from "@/context/WeatherContext";
import { useInView } from "react-intersection-observer";
import { formatPopulation, formatTimezone } from "@/lib/cityUtils";
import { formatTemperature } from "@/lib/weatherUtils";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

interface CitiesTableProps {
  searchParams: CitySearchParams;
}

export default function CitiesTable({ searchParams }: CitiesTableProps) {
  const [, navigate] = useLocation();
  const { unit } = useWeatherContext();
  const { ref, inView } = useInView();
  
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useCitiesSearch(searchParams);
  
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);
  
  const handleCityClick = (city: City) => {
    navigate(`/weather/${encodeURIComponent(city.name)}`);
  };
  
  const handleRightClick = (e: React.MouseEvent, city: City) => {
    e.preventDefault();
    window.open(`/weather/${encodeURIComponent(city.name)}`, '_blank');
  };

  // If initial loading state
  if (isLoading && !data) {
    return <LoadingState message="Loading cities..." />;
  }
  
  // If error state
  if (isError) {
    return (
      <ErrorState 
        message={`Error loading cities: ${error instanceof Error ? error.message : 'Unknown error'}`}
        onRetry={() => refetch()}
      />
    );
  }
  
  // Get all cities from all pages
  const cities: City[] = data?.pages.flatMap(page => page.cities) || [];
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="data-table-container overflow-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-100 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider sortable cursor-pointer">
                <div className="flex items-center">
                  City Name
                  <span className="material-icons ml-1 text-sm">
                    {searchParams.sort === 'name' 
                      ? (searchParams.sortDirection === 'asc' ? 'keyboard_arrow_up' : 'keyboard_arrow_down') 
                      : 'unfold_more'}
                  </span>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider sortable cursor-pointer">
                <div className="flex items-center">
                  Country
                  <span className="material-icons ml-1 text-sm">
                    {searchParams.sort === 'country_code' 
                      ? (searchParams.sortDirection === 'asc' ? 'keyboard_arrow_up' : 'keyboard_arrow_down') 
                      : 'unfold_more'}
                  </span>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider sortable cursor-pointer">
                <div className="flex items-center">
                  Population
                  <span className="material-icons ml-1 text-sm">
                    {searchParams.sort === 'population' 
                      ? (searchParams.sortDirection === 'asc' ? 'keyboard_arrow_up' : 'keyboard_arrow_down') 
                      : 'unfold_more'}
                  </span>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider sortable cursor-pointer">
                <div className="flex items-center">
                  Timezone
                  <span className="material-icons ml-1 text-sm">
                    {searchParams.sort === 'timezone' 
                      ? (searchParams.sortDirection === 'asc' ? 'keyboard_arrow_up' : 'keyboard_arrow_down') 
                      : 'unfold_more'}
                  </span>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                Weather
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {cities.map(city => (
              <tr 
                key={city.id} 
                className="city-row cursor-pointer"
                onClick={() => handleCityClick(city)}
                onContextMenu={(e) => handleRightClick(e, city)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-neutral-700">{city.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-700">{city.cou_name_en}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-700">{formatPopulation(city.population)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-700">{formatTimezone(city.timezone)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {city.weather ? (
                    <div className="text-sm text-neutral-700 flex items-center">
                      {city.weather.icon && (
                        <span className="material-icons text-secondary mr-1">
                          {city.weather.icon}
                        </span>
                      )}
                      <span>
                        {city.weather.temp_max !== undefined && city.weather.temp_min !== undefined ? (
                          `${formatTemperature(city.weather.temp_max, unit)} / ${formatTemperature(city.weather.temp_min, unit)}`
                        ) : (
                          'View details'
                        )}
                      </span>
                    </div>
                  ) : (
                    <div className="text-sm text-neutral-400">
                      Click to view
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Infinite scroll loading indicator */}
      {(hasNextPage || isFetchingNextPage) && (
        <div 
          ref={ref}
          className="flex justify-center items-center py-4 border-t border-neutral-200"
        >
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="ml-2 text-sm text-neutral-600">Loading more cities...</span>
        </div>
      )}
      
      {/* If no cities found */}
      {cities.length === 0 && !isLoading && (
        <div className="py-8 text-center">
          <p className="text-neutral-600">No cities found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
}
