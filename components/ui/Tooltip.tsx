'use client';

import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  variant?: 'default' | 'dark' | 'light';
}

export function Tooltip({
  content,
  children,
  position = 'top',
  className,
  variant = 'dark'
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  const getTooltipStyles = () => {
    switch (variant) {
      case 'light':
        return 'bg-white text-gray-800 border border-gray-200 shadow-lg';
      case 'dark':
      default:
        return 'bg-gray-900 text-white shadow-lg';
    }
  };

  const getArrowStyles = () => {
    const baseArrow = 'absolute w-0 h-0';

    switch (variant) {
      case 'light':
        switch (position) {
          case 'top':
            return `${baseArrow} top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-white`;
          case 'bottom':
            return `${baseArrow} bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-white`;
          case 'left':
            return `${baseArrow} left-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-white`;
          case 'right':
            return `${baseArrow} right-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-white`;
        }
        break;
      case 'dark':
      default:
        switch (position) {
          case 'top':
            return `${baseArrow} top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900`;
          case 'bottom':
            return `${baseArrow} bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900`;
          case 'left':
            return `${baseArrow} left-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-900`;
          case 'right':
            return `${baseArrow} right-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900`;
        }
    }
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            'absolute z-50 px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200 transform',
            'animate-in fade-in-0 zoom-in-95',
            getTooltipStyles(),
            positionClasses[position],
            className
          )}
          style={{
            maxWidth: '250px',
            whiteSpace: content.length > 30 ? 'normal' : 'nowrap'
          }}
        >
          {content}
          <div className={getArrowStyles()} />
        </div>
      )}
    </div>
  );
}