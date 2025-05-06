import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getCities, getCityByName, searchCities, getCitiesAutocomplete, getNearbyCity } from "./api/geonames";
import { getCurrentWeather, getForecast } from "./api/openweather";

export async function registerRoutes(app: Express): Promise<Server> {
  // Cities API endpoints
  app.get('/api/cities', async (req, res) => {
    try {
      const {
        query,
        countryCode,
        populationMin,
        timezone,
        sort = 'name',
        sortDirection = 'asc',
        offset = '0',
        limit = '20'
      } = req.query;

      const result = await getCities({
        query: typeof query === 'string' ? query : undefined,
        countryCode: typeof countryCode === 'string' ? countryCode : undefined,
        populationMin: typeof populationMin === 'string' ? parseInt(populationMin) : undefined,
        timezone: typeof timezone === 'string' ? timezone : undefined,
        sort: typeof sort === 'string' ? sort : 'name',
        sortDirection: sortDirection === 'desc' ? 'desc' : 'asc',
        offset: parseInt(typeof offset === 'string' ? offset : '0'),
        limit: parseInt(typeof limit === 'string' ? limit : '20')
      });

      res.json(result);
    } catch (error) {
      console.error('Error fetching cities:', error);
      res.status(500).json({ message: 'Error fetching cities' });
    }
  });

  // Get city by name
  app.get('/api/cities/:name', async (req, res) => {
    try {
      const { name } = req.params;
      const city = await getCityByName(decodeURIComponent(name));
      
      if (!city) {
        return res.status(404).json({ message: 'City not found' });
      }
      
      res.json(city);
    } catch (error) {
      console.error('Error fetching city:', error);
      res.status(500).json({ message: 'Error fetching city' });
    }
  });

  // Autocomplete for cities
  app.get('/api/cities/autocomplete', async (req, res) => {
    try {
      const { q } = req.query;
      if (typeof q !== 'string' || q.length < 2) {
        return res.json([]);
      }
      
      const suggestions = await getCitiesAutocomplete(q);
      res.json(suggestions);
    } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error);
      res.status(500).json({ message: 'Error fetching autocomplete suggestions' });
    }
  });

  // Get city near coordinates
  app.get('/api/cities/nearby', async (req, res) => {
    try {
      const { lat, lon } = req.query;
      if (typeof lat !== 'string' || typeof lon !== 'string') {
        return res.status(400).json({ message: 'Invalid coordinates' });
      }
      
      const city = await getNearbyCity(parseFloat(lat), parseFloat(lon));
      if (!city) {
        return res.status(404).json({ message: 'No city found near these coordinates' });
      }
      
      res.json(city);
    } catch (error) {
      console.error('Error finding nearby city:', error);
      res.status(500).json({ message: 'Error finding nearby city' });
    }
  });

  // Get countries list
  app.get('/api/countries', async (req, res) => {
    try {
      // Get stored countries or fetch them
      const countries = await storage.getCountries();
      res.json(countries);
    } catch (error) {
      console.error('Error fetching countries:', error);
      res.status(500).json({ message: 'Error fetching countries' });
    }
  });

  // Get timezones list
  app.get('/api/timezones', async (req, res) => {
    try {
      // Get stored timezones or fetch them
      const timezones = await storage.getTimezones();
      res.json(timezones);
    } catch (error) {
      console.error('Error fetching timezones:', error);
      res.status(500).json({ message: 'Error fetching timezones' });
    }
  });

  // Weather API endpoints
  app.get('/api/weather/current', async (req, res) => {
    try {
      const { lat, lon, units = 'metric' } = req.query;
      
      if (typeof lat !== 'string' || typeof lon !== 'string' || !lat || !lon) {
        return res.status(400).json({ message: 'Invalid coordinates' });
      }
      
      try {
        const parsedLat = parseFloat(lat);
        const parsedLon = parseFloat(lon);
        
        if (isNaN(parsedLat) || isNaN(parsedLon)) {
          return res.status(400).json({ message: 'Invalid coordinates: could not parse as numbers' });
        }
        
        const weather = await getCurrentWeather(
          parsedLat, 
          parsedLon, 
          units as 'metric' | 'imperial'
        );
        
        res.json(weather);
      } catch (parseError) {
        console.error('Error parsing coordinates:', parseError);
        return res.status(400).json({ message: 'Invalid coordinates format' });
      }
    } catch (error) {
      console.error('Error fetching current weather:', error);
      res.status(500).json({ message: 'Error fetching current weather' });
    }
  });

  app.get('/api/weather/forecast', async (req, res) => {
    try {
      const { lat, lon, units = 'metric' } = req.query;
      
      if (typeof lat !== 'string' || typeof lon !== 'string') {
        return res.status(400).json({ message: 'Invalid coordinates' });
      }
      
      const forecast = await getForecast(
        parseFloat(lat), 
        parseFloat(lon), 
        units as 'metric' | 'imperial'
      );
      
      res.json(forecast);
    } catch (error) {
      console.error('Error fetching forecast:', error);
      res.status(500).json({ message: 'Error fetching forecast' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
