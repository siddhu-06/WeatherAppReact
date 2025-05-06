import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

interface LocationErrorModalProps {
  onClose: () => void;
}

export default function LocationErrorModal({ onClose }: LocationErrorModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        <div className="bg-red-500 p-4 flex justify-between items-center">
          <h3 className="text-lg font-medium text-white">Location Error</h3>
          <button onClick={onClose} className="text-white">
            <XCircle className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col gap-4">
            <p className="text-gray-700">Couldn't find a city near your location.</p>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Try these options:</h4>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Search for a city by name using the search box</li>
                <li>Try moving to a more populated area before using location detection</li>
                <li>Check your internet connection and try again</li>
                <li>Make sure location permissions are enabled in your browser</li>
              </ul>
            </div>
            
            <div className="flex justify-end space-x-3 mt-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => {
                onClose();
                // Wait a bit before showing the search hint
                setTimeout(() => {
                  const searchInput = document.querySelector('input[placeholder*="Search"]');
                  if (searchInput) {
                    searchInput.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
                    setTimeout(() => {
                      searchInput.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
                    }, 2000);
                  }
                }, 500);
              }}>
                Search Instead
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}