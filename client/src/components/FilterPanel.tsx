import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useCountries, useTimezones } from "@/hooks/useCity";

interface FilterPanelProps {
  isOpen: boolean;
  onFilter: (filters: {
    countryCode: string;
    populationMin: number | null;
    timezone: string;
  }) => void;
  onReset: () => void;
}

export default function FilterPanel({ isOpen, onFilter, onReset }: FilterPanelProps) {
  const [countryCode, setCountryCode] = useState("");
  const [populationMin, setPopulationMin] = useState<string>("");
  const [timezone, setTimezone] = useState("");
  
  const { data: countries = [] } = useCountries();
  const { data: timezones = [] } = useTimezones();
  
  const handleApplyFilters = () => {
    onFilter({
      countryCode,
      populationMin: populationMin ? parseInt(populationMin) : null,
      timezone,
    });
  };
  
  const handleResetFilters = () => {
    setCountryCode("");
    setPopulationMin("");
    setTimezone("");
    onReset();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label className="block text-sm font-medium text-neutral-700 mb-1">Country</Label>
          <Select value={countryCode} onValueChange={setCountryCode}>
            <SelectTrigger>
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Countries</SelectItem>
              {countries.map(country => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="block text-sm font-medium text-neutral-700 mb-1">Population</Label>
          <Select value={populationMin} onValueChange={setPopulationMin}>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              <SelectItem value="1000000">Above 1,000,000</SelectItem>
              <SelectItem value="500000">Above 500,000</SelectItem>
              <SelectItem value="100000">Above 100,000</SelectItem>
              <SelectItem value="50000">Above 50,000</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="block text-sm font-medium text-neutral-700 mb-1">Timezone</Label>
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger>
              <SelectValue placeholder="All Timezones" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Timezones</SelectItem>
              {timezones.map(tz => (
                <SelectItem key={tz} value={tz}>
                  {tz.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end mt-4 gap-2">
        <Button 
          variant="outline" 
          onClick={handleResetFilters}
        >
          Reset
        </Button>
        <Button 
          onClick={handleApplyFilters}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
