import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedWeatherIconProps {
  iconCode: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// Map OpenWeatherMap icon codes to our animation types
// Icon codes: https://openweathermap.org/weather-conditions
const getAnimationType = (iconCode: string): string => {
  // Icon codes end with 'd' for day or 'n' for night
  const isDaytime = iconCode.endsWith('d');
  const code = iconCode.slice(0, -1); // Remove the 'd' or 'n' suffix
  
  switch (code) {
    case '01': // clear sky
      return isDaytime ? 'clear-day' : 'clear-night';
    case '02': // few clouds
      return isDaytime ? 'partly-cloudy-day' : 'partly-cloudy-night';
    case '03': // scattered clouds
    case '04': // broken clouds
      return 'cloudy';
    case '09': // shower rain
      return 'rain';
    case '10': // rain
      return isDaytime ? 'rain-day' : 'rain-night';
    case '11': // thunderstorm
      return 'thunderstorm';
    case '13': // snow
      return 'snow';
    case '50': // mist/fog
      return 'fog';
    default:
      return 'unknown';
  }
};

const AnimatedWeatherIcon: React.FC<AnimatedWeatherIconProps> = ({ 
  iconCode, 
  size = 'md',
  className 
}) => {
  const animationType = getAnimationType(iconCode);
  
  // Size mapping
  const sizeClass = {
    'sm': 'w-8 h-8',
    'md': 'w-16 h-16',
    'lg': 'w-24 h-24',
    'xl': 'w-32 h-32'
  }[size];
  
  // Render different SVG based on animation type
  const renderIcon = () => {
    switch (animationType) {
      case 'clear-day':
        return (
          <div className={cn("relative", sizeClass, className)}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3/5 h-3/5 bg-yellow-400 rounded-full animate-pulse-slow"></div>
            </div>
            <div className="absolute inset-0">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1/4 bg-yellow-400 animate-sun-ray"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1/4 bg-yellow-400 animate-sun-ray"></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/4 h-1 bg-yellow-400 animate-sun-ray"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/4 h-1 bg-yellow-400 animate-sun-ray"></div>
              
              <div className="absolute top-[15%] left-[15%] w-1 h-1/5 bg-yellow-400 animate-sun-ray transform rotate-45"></div>
              <div className="absolute bottom-[15%] right-[15%] w-1 h-1/5 bg-yellow-400 animate-sun-ray transform rotate-45"></div>
              <div className="absolute top-[15%] right-[15%] w-1 h-1/5 bg-yellow-400 animate-sun-ray transform rotate-[-45deg]"></div>
              <div className="absolute bottom-[15%] left-[15%] w-1 h-1/5 bg-yellow-400 animate-sun-ray transform rotate-[-45deg]"></div>
            </div>
          </div>
        );
        
      case 'clear-night':
        return (
          <div className={cn("relative", sizeClass, className)}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2/3 h-2/3 bg-slate-300 rounded-full animate-glow-soft"></div>
            </div>
            <div className="absolute top-1/4 left-[20%] w-1/6 h-1/6 bg-slate-600 rounded-full"></div>
            <div className="absolute top-1/2 left-[60%] w-1/8 h-1/8 bg-slate-600 rounded-full"></div>
          </div>
        );
        
      case 'partly-cloudy-day':
        return (
          <div className={cn("relative", sizeClass, className)}>
            {/* Sun */}
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2">
              <div className="w-full h-full bg-yellow-400 rounded-full animate-pulse-slow"></div>
            </div>
            
            {/* Cloud */}
            <div className="absolute bottom-1/4 right-1/4 w-2/3 h-1/2 animate-drift-slow">
              <div className="absolute bottom-0 left-1/4 w-1/2 h-1/2 bg-white rounded-full shadow-md"></div>
              <div className="absolute bottom-0 left-1/2 w-1/2 h-1/2 bg-white rounded-full shadow-md"></div>
              <div className="absolute bottom-1/4 left-1/3 w-1/2 h-1/2 bg-white rounded-full shadow-md"></div>
              <div className="absolute bottom-1/4 left-1/6 w-1/2 h-1/2 bg-white rounded-full shadow-md"></div>
            </div>
          </div>
        );
        
      case 'partly-cloudy-night':
        return (
          <div className={cn("relative", sizeClass, className)}>
            {/* Moon */}
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2">
              <div className="w-full h-full bg-slate-300 rounded-full animate-glow-soft"></div>
            </div>
            
            {/* Cloud */}
            <div className="absolute bottom-1/4 right-1/4 w-2/3 h-1/2 animate-drift-slow">
              <div className="absolute bottom-0 left-1/4 w-1/2 h-1/2 bg-gray-200 rounded-full shadow-md"></div>
              <div className="absolute bottom-0 left-1/2 w-1/2 h-1/2 bg-gray-200 rounded-full shadow-md"></div>
              <div className="absolute bottom-1/4 left-1/3 w-1/2 h-1/2 bg-gray-200 rounded-full shadow-md"></div>
              <div className="absolute bottom-1/4 left-1/6 w-1/2 h-1/2 bg-gray-200 rounded-full shadow-md"></div>
            </div>
          </div>
        );
        
      case 'cloudy':
        return (
          <div className={cn("relative", sizeClass, className)}>
            <div className="absolute inset-0 animate-drift-slow">
              <div className="absolute bottom-1/4 left-1/6 w-1/3 h-1/3 bg-gray-200 rounded-full shadow-md"></div>
              <div className="absolute bottom-1/4 left-5/12 w-1/3 h-1/3 bg-gray-200 rounded-full shadow-md"></div>
              <div className="absolute bottom-1/2 left-1/4 w-1/3 h-1/3 bg-gray-300 rounded-full shadow-md"></div>
              <div className="absolute bottom-1/2 left-1/2 w-1/3 h-1/3 bg-gray-300 rounded-full shadow-md"></div>
              <div className="absolute bottom-1/2 left-0 w-1/3 h-1/3 bg-gray-300 rounded-full shadow-md"></div>
            </div>
          </div>
        );
        
      case 'rain':
      case 'rain-day':
      case 'rain-night':
        return (
          <div className={cn("relative overflow-hidden", sizeClass, className)}>
            {/* Cloud */}
            <div className="absolute inset-x-0 top-0 h-1/2">
              <div className="absolute bottom-0 left-1/6 w-1/3 h-2/3 bg-gray-400 rounded-full"></div>
              <div className="absolute bottom-0 left-5/12 w-1/3 h-2/3 bg-gray-400 rounded-full"></div>
              <div className="absolute bottom-1/3 left-1/4 w-1/3 h-2/3 bg-gray-500 rounded-full"></div>
              <div className="absolute bottom-1/3 left-1/2 w-1/3 h-2/3 bg-gray-500 rounded-full"></div>
              <div className="absolute bottom-1/3 left-0 w-1/3 h-2/3 bg-gray-500 rounded-full"></div>
            </div>
            
            {/* Rain drops */}
            <div className="absolute inset-x-0 bottom-0 h-1/2">
              <div className="absolute top-0 left-1/4 w-[2px] h-[10%] bg-blue-400 animate-rain-drop-1"></div>
              <div className="absolute top-[10%] left-1/2 w-[2px] h-[10%] bg-blue-400 animate-rain-drop-2"></div>
              <div className="absolute top-[5%] left-3/4 w-[2px] h-[10%] bg-blue-400 animate-rain-drop-3"></div>
              <div className="absolute top-[15%] left-1/3 w-[2px] h-[10%] bg-blue-400 animate-rain-drop-2"></div>
              <div className="absolute top-[20%] left-2/3 w-[2px] h-[10%] bg-blue-400 animate-rain-drop-1"></div>
            </div>
          </div>
        );
        
      case 'thunderstorm':
        return (
          <div className={cn("relative overflow-hidden", sizeClass, className)}>
            {/* Cloud */}
            <div className="absolute inset-x-0 top-0 h-1/2">
              <div className="absolute bottom-0 left-1/6 w-1/3 h-2/3 bg-gray-600 rounded-full"></div>
              <div className="absolute bottom-0 left-5/12 w-1/3 h-2/3 bg-gray-600 rounded-full"></div>
              <div className="absolute bottom-1/3 left-1/4 w-1/3 h-2/3 bg-gray-700 rounded-full"></div>
              <div className="absolute bottom-1/3 left-1/2 w-1/3 h-2/3 bg-gray-700 rounded-full"></div>
              <div className="absolute bottom-1/3 left-0 w-1/3 h-2/3 bg-gray-700 rounded-full"></div>
            </div>
            
            {/* Lightning bolt */}
            <div className="absolute left-1/2 top-1/3 -translate-x-1/2">
              <div className="w-[4px] h-[40%] bg-yellow-300 animate-lightning-flash"></div>
              <div className="absolute left-0 top-[40%] w-[8px] h-[20%] bg-yellow-300 transform -rotate-45 animate-lightning-flash"></div>
              <div className="absolute left-0 top-[60%] w-[4px] h-[30%] bg-yellow-300 animate-lightning-flash"></div>
            </div>
            
            {/* Rain drops */}
            <div className="absolute inset-x-0 bottom-0 h-1/3">
              <div className="absolute top-0 left-1/4 w-[2px] h-[15%] bg-blue-400 animate-rain-drop-1"></div>
              <div className="absolute top-[5%] left-3/4 w-[2px] h-[15%] bg-blue-400 animate-rain-drop-2"></div>
            </div>
          </div>
        );
        
      case 'snow':
        return (
          <div className={cn("relative overflow-hidden", sizeClass, className)}>
            {/* Cloud */}
            <div className="absolute inset-x-0 top-0 h-1/2">
              <div className="absolute bottom-0 left-1/6 w-1/3 h-2/3 bg-gray-300 rounded-full"></div>
              <div className="absolute bottom-0 left-5/12 w-1/3 h-2/3 bg-gray-300 rounded-full"></div>
              <div className="absolute bottom-1/3 left-1/4 w-1/3 h-2/3 bg-gray-400 rounded-full"></div>
              <div className="absolute bottom-1/3 left-1/2 w-1/3 h-2/3 bg-gray-400 rounded-full"></div>
              <div className="absolute bottom-1/3 left-0 w-1/3 h-2/3 bg-gray-400 rounded-full"></div>
            </div>
            
            {/* Snowflakes */}
            <div className="absolute inset-x-0 bottom-0 h-1/2">
              <div className="absolute top-[5%] left-1/4 w-[6px] h-[6px] bg-white rounded-full animate-snow-fall-1"></div>
              <div className="absolute top-[15%] left-1/2 w-[6px] h-[6px] bg-white rounded-full animate-snow-fall-2"></div>
              <div className="absolute top-[8%] left-3/4 w-[6px] h-[6px] bg-white rounded-full animate-snow-fall-3"></div>
              <div className="absolute top-[20%] left-1/3 w-[6px] h-[6px] bg-white rounded-full animate-snow-fall-2"></div>
              <div className="absolute top-[12%] left-2/3 w-[6px] h-[6px] bg-white rounded-full animate-snow-fall-1"></div>
            </div>
          </div>
        );
        
      case 'fog':
        return (
          <div className={cn("relative", sizeClass, className)}>
            <div className="absolute inset-0">
              <div className="absolute top-1/6 inset-x-0 h-[3px] bg-gray-300 animate-fog-drift-1"></div>
              <div className="absolute top-1/3 inset-x-0 h-[4px] bg-gray-300 animate-fog-drift-2"></div>
              <div className="absolute top-1/2 inset-x-0 h-[5px] bg-gray-300 animate-fog-drift-1"></div>
              <div className="absolute top-2/3 inset-x-0 h-[4px] bg-gray-300 animate-fog-drift-2"></div>
              <div className="absolute top-5/6 inset-x-0 h-[3px] bg-gray-300 animate-fog-drift-1"></div>
            </div>
          </div>
        );
        
      default:
        // Fallback to a question mark for unknown weather
        return (
          <div className={cn("flex items-center justify-center", sizeClass, className)}>
            <div className="text-gray-400 text-xl font-bold">?</div>
          </div>
        );
    }
  };
  
  return renderIcon();
};

export default AnimatedWeatherIcon;