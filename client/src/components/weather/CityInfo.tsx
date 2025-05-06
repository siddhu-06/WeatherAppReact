import { City } from "@/types/city";
import { formatPopulation, formatTimezone, getLocalTime, formatCoordinates } from "@/lib/cityUtils";

interface CityInfoProps {
  city: City;
}

export default function CityInfo({ city }: CityInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-neutral-700 mb-4">City Information</h3>
        <div className="space-y-4">
          <div>
            <div className="text-sm text-neutral-400">Country</div>
            <div className="font-medium">{city.cou_name_en}</div>
          </div>
          <div>
            <div className="text-sm text-neutral-400">Population</div>
            <div className="font-medium">{formatPopulation(city.population)}</div>
          </div>
          <div>
            <div className="text-sm text-neutral-400">Timezone</div>
            <div className="font-medium">{formatTimezone(city.timezone)}</div>
          </div>
          <div>
            <div className="text-sm text-neutral-400">Local Time</div>
            <div className="font-medium">{getLocalTime(city.timezone)}</div>
          </div>
          <div>
            <div className="text-sm text-neutral-400">Coordinates</div>
            <div className="font-medium">{formatCoordinates(city.coordinates.lat, city.coordinates.lon)}</div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Map component - we'll use an iframe to embed OpenStreetMap */}
        <iframe 
          title="City Map"
          width="100%" 
          height="100%" 
          style={{ border: 0, minHeight: '250px' }}
          loading="lazy" 
          allowFullScreen
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${city.coordinates.lon-0.02},${city.coordinates.lat-0.02},${city.coordinates.lon+0.02},${city.coordinates.lat+0.02}&layer=mapnik&marker=${city.coordinates.lat},${city.coordinates.lon}`}
        ></iframe>
      </div>
    </div>
  );
}
