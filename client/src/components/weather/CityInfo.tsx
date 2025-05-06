import { City } from "@/types/city";
import { formatPopulation, formatTimezone, getLocalTime, formatCoordinates } from "@/lib/cityUtils";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icons
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Fix the default icon issue
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface CityInfoProps {
  city: City;
}

export default function CityInfo({ city }: CityInfoProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  // Only render the map after component mounts to avoid SSR issues
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Parse coordinates as numbers
  const lat = parseFloat(city.coordinates.lat);
  const lon = parseFloat(city.coordinates.lon);
  
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
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ minHeight: '300px' }}>
        {isMounted && (
          <MapContainer 
            center={[lat, lon]} 
            zoom={12} 
            style={{ height: '100%', minHeight: '300px', width: '100%' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[lat, lon]}>
              <Popup>
                {city.name}, {city.cou_name_en}
              </Popup>
            </Marker>
          </MapContainer>
        )}
      </div>
    </div>
  );
}
