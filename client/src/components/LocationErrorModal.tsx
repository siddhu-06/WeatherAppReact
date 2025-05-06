import { Button } from "@/components/ui/button";
import { XCircle, MapPin, Search, Globe, Settings, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

interface LocationErrorModalProps {
  onClose: () => void;
}

export default function LocationErrorModal({ onClose }: LocationErrorModalProps) {
  const [errorType, setErrorType] = useState<"permission" | "notFound" | "connection">("notFound");
  
  // Listen for error type from the custom event
  useEffect(() => {
    // Handler for custom event with error type details
    const handleLocationErrorEvent = (event: Event) => {
      // Check if this is a CustomEvent with detail
      if (event instanceof CustomEvent && event.detail && event.detail.type) {
        setErrorType(event.detail.type);
      } else {
        // Fallback to checking permissions if no error type provided
        checkPermissions();
      }
    };
    
    // Add listener for custom location-error event
    window.addEventListener('location-error', handleLocationErrorEvent);
    
    return () => {
      window.removeEventListener('location-error', handleLocationErrorEvent);
    };
  }, []);
  
  // Try to determine the error type based on browser permissions as a fallback
  const checkPermissions = () => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName }).then(permissionStatus => {
        if (permissionStatus.state === 'denied') {
          setErrorType("permission");
        }
      }).catch(() => {
        // Permissions API failed, keep default
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 flex justify-between items-center">
          <h3 className="text-lg font-medium text-white flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Location Error
          </h3>
          <button onClick={onClose} className="text-white hover:bg-red-600 rounded-full p-1">
            <XCircle className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col gap-4">
            {errorType === "permission" ? (
              <div className="flex flex-col gap-2">
                <p className="text-gray-700 font-medium flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-amber-500" />
                  Location access is blocked
                </p>
                <p className="text-gray-600">
                  Your browser is blocking access to your location. To use this feature, you'll need to update your browser permissions.
                </p>
              </div>
            ) : errorType === "connection" ? (
              <div className="flex flex-col gap-2">
                <p className="text-gray-700 font-medium flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-amber-500" />
                  Connection issue
                </p>
                <p className="text-gray-600">
                  We couldn't connect to our location service. This might be due to network issues or a temporary service outage.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-gray-700 font-medium flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-amber-500" />
                  No city found
                </p>
                <p className="text-gray-600">
                  We couldn't find a major city near your current location. Try searching for a specific city instead.
                </p>
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h4 className="font-medium text-gray-800 mb-2">Troubleshooting steps:</h4>
              <ul className="space-y-3 text-gray-600">
                {errorType === "permission" ? (
                  <>
                    <li className="flex items-start gap-2">
                      <div className="bg-blue-500 text-white rounded-full min-w-[20px] h-[20px] flex items-center justify-center text-xs mt-0.5">1</div>
                      <span>Look for the location icon in your browser's address bar and click to allow access</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-blue-500 text-white rounded-full min-w-[20px] h-[20px] flex items-center justify-center text-xs mt-0.5">2</div>
                      <span>Or go to your browser's site settings and enable location permissions for this website</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-blue-500 text-white rounded-full min-w-[20px] h-[20px] flex items-center justify-center text-xs mt-0.5">3</div>
                      <span>After enabling permissions, refresh the page and try again</span>
                    </li>
                  </>
                ) : errorType === "connection" ? (
                  <>
                    <li className="flex items-start gap-2">
                      <div className="bg-blue-500 text-white rounded-full min-w-[20px] h-[20px] flex items-center justify-center text-xs mt-0.5">1</div>
                      <span>Check your internet connection and refresh the page</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-blue-500 text-white rounded-full min-w-[20px] h-[20px] flex items-center justify-center text-xs mt-0.5">2</div>
                      <span>Try again in a few minutes - our services might be temporarily unavailable</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-blue-500 text-white rounded-full min-w-[20px] h-[20px] flex items-center justify-center text-xs mt-0.5">3</div>
                      <span>If the problem persists, try using the search feature instead</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start gap-2">
                      <div className="bg-blue-500 text-white rounded-full min-w-[20px] h-[20px] flex items-center justify-center text-xs mt-0.5">1</div>
                      <span>Try searching for a city by name using the search box at the top</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-blue-500 text-white rounded-full min-w-[20px] h-[20px] flex items-center justify-center text-xs mt-0.5">2</div>
                      <span>Make sure your device has an active internet connection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-blue-500 text-white rounded-full min-w-[20px] h-[20px] flex items-center justify-center text-xs mt-0.5">3</div>
                      <span>Our database includes cities with population over 1,000. You might be in a less populated area</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
            
            <div className="flex justify-end space-x-3 mt-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button 
                onClick={() => {
                  onClose();
                  // Wait a bit before showing the search hint
                  setTimeout(() => {
                    const searchInput = document.querySelector('input[placeholder*="Search"]');
                    if (searchInput) {
                      searchInput.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
                      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      setTimeout(() => {
                        searchInput.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
                      }, 2000);
                    }
                  }, 300);
                }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                <Search className="h-4 w-4 mr-2" />
                Search Instead
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}