import React from 'react';
import { cn } from '@/lib/utils';

type IconSize = 'sm' | 'md' | 'lg' | 'xl';

interface AnimatedWeatherIconProps {
  iconCode: string;
  size?: IconSize;
  className?: string;
}

const sizeMap: Record<IconSize, string> = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

const AnimatedWeatherIcon: React.FC<AnimatedWeatherIconProps> = ({ 
  iconCode, 
  size = 'md',
  className 
}) => {
  const renderIcon = () => {
    // Clear sky (day)
    if (iconCode === '01d') {
      return (
        <div className={cn('relative', sizeMap[size], className)}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-3/4 rounded-full bg-yellow-400 animate-pulse-slow shadow-lg"></div>
          </div>
          <div className="absolute inset-0 animate-spin-very-slow">
            {Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={i} 
                className="absolute w-1/6 h-1/3 bg-yellow-300"
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: '0 0',
                  transform: `rotate(${45 * i}deg) translate(-50%, -100%)`,
                  opacity: 0.7,
                  borderRadius: '50%'
                }}
              ></div>
            ))}
          </div>
        </div>
      );
    }
    
    // Clear sky (night)
    if (iconCode === '01n') {
      return (
        <div className={cn('relative', sizeMap[size], className)}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-3/4 rounded-full bg-blue-200 animate-pulse-slow shadow-lg"></div>
          </div>
          <div className="absolute top-0 right-0 w-1/3 h-1/3 rounded-full bg-blue-100 animate-pulse-fast"></div>
        </div>
      );
    }
    
    // Few clouds (day)
    if (iconCode === '02d') {
      return (
        <div className={cn('relative', sizeMap[size], className)}>
          <div className="absolute left-0 top-0 w-1/2 h-1/2">
            <div className="w-full h-full rounded-full bg-yellow-400 animate-pulse-slow"></div>
          </div>
          <div className="absolute right-0 bottom-0 w-3/4 h-2/3 flex items-center justify-center">
            <div className="w-full h-full bg-gray-200 rounded-full animate-float-slow"></div>
            <div className="absolute -left-1/4 top-1/4 w-1/2 h-1/2 bg-gray-100 rounded-full animate-float-slow"></div>
          </div>
        </div>
      );
    }
    
    // Few clouds (night)
    if (iconCode === '02n') {
      return (
        <div className={cn('relative', sizeMap[size], className)}>
          <div className="absolute left-0 top-0 w-1/2 h-1/2">
            <div className="w-full h-full rounded-full bg-blue-200 animate-pulse-slow"></div>
          </div>
          <div className="absolute right-0 bottom-0 w-3/4 h-2/3 flex items-center justify-center">
            <div className="w-full h-full bg-gray-300 rounded-full animate-float-slow"></div>
            <div className="absolute -left-1/4 top-1/4 w-1/2 h-1/2 bg-gray-200 rounded-full animate-float-slow"></div>
          </div>
        </div>
      );
    }
    
    // Scattered/broken clouds (day/night)
    if (['03d', '03n', '04d', '04n'].includes(iconCode)) {
      return (
        <div className={cn('relative', sizeMap[size], className)}>
          <div className="absolute w-2/3 h-1/2 bg-gray-300 rounded-full animate-float-slow 
            left-0 top-1/4"></div>
          <div className="absolute w-1/2 h-1/2 bg-gray-400 rounded-full animate-float-slow-reverse 
            right-0 top-0"></div>
          <div className="absolute w-1/2 h-1/2 bg-gray-200 rounded-full animate-float-slow 
            right-1/4 bottom-0"></div>
        </div>
      );
    }
    
    // Shower rain
    if (['09d', '09n'].includes(iconCode)) {
      return (
        <div className={cn('relative', sizeMap[size], className)}>
          <div className="absolute w-full h-1/2 bg-gray-400 rounded-full top-0"></div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-0.5 h-1/4 bg-blue-400 animate-rain"
              style={{
                left: `${20 + i * 15}%`,
                top: '60%',
                animationDelay: `${i * 0.2}s`
              }}
            ></div>
          ))}
        </div>
      );
    }
    
    // Rain
    if (['10d', '10n'].includes(iconCode)) {
      return (
        <div className={cn('relative', sizeMap[size], className)}>
          <div className="absolute w-full h-1/2 bg-gray-400 rounded-full top-0 animate-float-slow"></div>
          {iconCode === '10d' && (
            <div className="absolute w-1/3 h-1/3 bg-yellow-400 rounded-full top-0 left-0"></div>
          )}
          {Array.from({ length: 7 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-0.5 h-1/4 bg-blue-400 animate-rain"
              style={{
                left: `${10 + i * 12}%`,
                top: '60%',
                animationDelay: `${i * 0.15}s`
              }}
            ></div>
          ))}
        </div>
      );
    }
    
    // Thunderstorm
    if (['11d', '11n'].includes(iconCode)) {
      return (
        <div className={cn('relative', sizeMap[size], className)}>
          <div className="absolute w-full h-1/2 bg-gray-600 rounded-full top-0 animate-float-slow"></div>
          <div className="absolute w-1/4 h-1/2 bg-yellow-400 
            bottom-0 left-1/3 animate-flash"
            style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 60%, 50% 80%, 0% 60%, 100% 0%)' }}
          ></div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-0.5 h-1/5 bg-blue-400 animate-rain"
              style={{
                left: `${20 + i * 25}%`,
                top: '50%',
                animationDelay: `${i * 0.3}s`
              }}
            ></div>
          ))}
        </div>
      );
    }
    
    // Snow
    if (['13d', '13n'].includes(iconCode)) {
      return (
        <div className={cn('relative', sizeMap[size], className)}>
          <div className="absolute w-full h-1/2 bg-gray-300 rounded-full top-0"></div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full animate-snow"
              style={{
                left: `${15 + i * 15}%`,
                top: '55%',
                animationDelay: `${i * 0.2}s`
              }}
            ></div>
          ))}
        </div>
      );
    }
    
    // Mist/fog
    if (['50d', '50n'].includes(iconCode)) {
      return (
        <div className={cn('relative', sizeMap[size], className)}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div 
              key={i}
              className="absolute h-1.5 bg-gray-300 rounded-full animate-fog"
              style={{
                width: `${60 + Math.random() * 40}%`,
                left: `${Math.random() * 20}%`,
                top: `${20 + i * 20}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      );
    }
    
    // Default/fallback icon
    return (
      <div className={cn('relative flex items-center justify-center', sizeMap[size], className)}>
        <div className="w-3/4 h-3/4 rounded-full bg-gray-200"></div>
        <span className="absolute text-gray-500 text-xs">?</span>
      </div>
    );
  };

  return renderIcon();
};

export default AnimatedWeatherIcon;