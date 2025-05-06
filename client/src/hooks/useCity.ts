import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { City, CitySearchParams, AutocompleteSuggestion } from "@/types/city";
import { apiRequest } from "@/lib/queryClient";

export function useCitiesSearch(params: CitySearchParams) {
  return useInfiniteQuery({
    queryKey: ['/api/cities', params],
    queryFn: async ({ pageParam = 0 }) => {
      const searchParams = new URLSearchParams();
      
      if (params.query) searchParams.append('query', params.query);
      if (params.countryCode) searchParams.append('countryCode', params.countryCode);
      if (params.populationMin) searchParams.append('populationMin', params.populationMin.toString());
      if (params.timezone) searchParams.append('timezone', params.timezone);
      if (params.sort) searchParams.append('sort', params.sort);
      if (params.sortDirection) searchParams.append('sortDirection', params.sortDirection);
      
      const limit = params.limit || 20;
      searchParams.append('limit', limit.toString());
      searchParams.append('offset', (pageParam * limit).toString());
      
      const response = await fetch(`/api/cities?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch cities');
      }
      return await response.json();
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCity(cityName: string) {
  return useQuery({
    queryKey: [`/api/cities/${encodeURIComponent(cityName)}`],
    enabled: !!cityName,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

export function useAutocomplete(query: string) {
  return useQuery<AutocompleteSuggestion[]>({
    queryKey: ['/api/cities/autocomplete', query],
    enabled: query.length > 1,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useCountries() {
  return useQuery<{ code: string; name: string }[]>({
    queryKey: ['/api/countries'],
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

export function useTimezones() {
  return useQuery<string[]>({
    queryKey: ['/api/timezones'],
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}
