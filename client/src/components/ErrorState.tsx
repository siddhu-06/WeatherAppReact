import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  message: string;
  title?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, title = "Error Loading Data", onRetry }: ErrorStateProps) {
  return (
    <div className="bg-red-50 border border-red-200 p-6 rounded-lg shadow-sm">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-medium text-red-700">{title}</h3>
          <div className="mt-2 text-red-600">
            {message || "We encountered a problem while fetching the data. Please try again later."}
          </div>
          
          <div className="mt-4 bg-white p-3 rounded border border-red-100">
            <h4 className="font-medium text-gray-800 text-sm mb-2">Try these suggestions:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              <li>Check your internet connection</li>
              <li>Refresh the page</li>
              <li>Try again in a few moments</li>
              {message.includes("API") && <li>The weather service might be temporarily unavailable</li>}
            </ul>
          </div>
          
          {onRetry && (
            <div className="mt-4 flex space-x-2">
              <Button 
                variant="destructive"
                onClick={onRetry}
                className="flex items-center"
              >
                <span className="material-icons mr-1 text-sm">refresh</span>
                Try Again
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => window.location.reload()}
                className="flex items-center"
              >
                <span className="material-icons mr-1 text-sm">replay</span>
                Refresh Page
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
