export interface City {
  id: string;
  name: string;
  ascii_name: string;
  alternate_names?: string[];
  country_code: string;
  cou_name_en: string;
  population: number;
  timezone: string;
  coordinates: {
    lat: string;
    lon: string;
  };
  weather?: {
    temp_max?: number;
    temp_min?: number;
    icon?: string;
  };
}

export interface CitySearchParams {
  query?: string;
  countryCode?: string;
  populationMin?: number;
  timezone?: string;
  sort?: string;
  sortDirection?: 'asc' | 'desc';
  offset?: number;
  limit?: number;
}

export interface AutocompleteSuggestion {
  id: string;
  name: string;
  country: string;
}
