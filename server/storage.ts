import { db } from "@db";

// In-memory cache for frequently used data
let countriesCache: { code: string; name: string }[] | null = null;
let timezonesCache: string[] | null = null;

export const storage = {
  // Get list of countries
  getCountries: async (): Promise<{ code: string; name: string }[]> => {
    if (countriesCache) {
      return countriesCache;
    }

    // This would typically be fetched from a database
    // Since we don't have a countries table, we'll return a static list
    const countries = [
      { code: "US", name: "United States" },
      { code: "GB", name: "United Kingdom" },
      { code: "CA", name: "Canada" },
      { code: "AU", name: "Australia" },
      { code: "DE", name: "Germany" },
      { code: "FR", name: "France" },
      { code: "IT", name: "Italy" },
      { code: "ES", name: "Spain" },
      { code: "JP", name: "Japan" },
      { code: "CN", name: "China" },
      { code: "IN", name: "India" },
      { code: "BR", name: "Brazil" },
      { code: "RU", name: "Russia" },
      { code: "ZA", name: "South Africa" },
      { code: "MX", name: "Mexico" },
    ];

    countriesCache = countries;
    return countries;
  },

  // Get list of timezones
  getTimezones: async (): Promise<string[]> => {
    if (timezonesCache) {
      return timezonesCache;
    }

    // This would typically be fetched from a database
    // Since we don't have a timezones table, we'll return a static list
    const timezones = [
      "America/New_York",
      "America/Chicago",
      "America/Denver",
      "America/Los_Angeles",
      "America/Toronto",
      "Europe/London",
      "Europe/Paris",
      "Europe/Berlin",
      "Europe/Madrid",
      "Europe/Rome",
      "Asia/Tokyo",
      "Asia/Shanghai",
      "Asia/Kolkata",
      "Australia/Sydney",
      "Pacific/Auckland",
    ];

    timezonesCache = timezones;
    return timezones;
  },
};
