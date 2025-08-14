'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  // Ref to the element that triggers the tooltip (the children)
  const triggerRef = useRef<HTMLDivElement>(null);
  // State to hold the calculated position of the tooltip
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  // State to ensure portal is only rendered on the client
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Portals need the `document` object, which is only available on the client.
    // This prevents SSR errors in frameworks like Next.js.
    setIsClient(true);
  }, []);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      // Get the position and dimensions of the trigger element
      const rect = triggerRef.current.getBoundingClientRect();

      // Calculate the position for the tooltip
      let top = 0, left = 0;
      // The pixel values for the margin/gap between the element and tooltip
      const gap = 8;

      switch (position) {
        case 'top':
          top = rect.top + window.scrollY - gap; // Subtract 8px for margin
          left = rect.left + window.scrollX + rect.width / 2;
          break;
        case 'bottom':
          top = rect.bottom + window.scrollY + gap;
          left = rect.left + window.scrollX + rect.width / 2;
          break;
        case 'left':
          top = rect.top + window.scrollY + rect.height / 2;
          left = rect.left + window.scrollX - gap;
          break;
        case 'right':
          top = rect.top + window.scrollY + rect.height / 2;
          left = rect.right + window.scrollX + gap;
          break;
      }

      setTooltipPosition({ top, left });
      setIsVisible(true);
    }
  };

  // The transform classes now adjust the tooltip relative to its calculated top/left point
  const positionClasses = {
    top: 'transform -translate-x-1/2 -translate-y-full',
    bottom: 'transform -translate-x-1/2',
    left: 'transform -translate-y-1/2 -translate-x-full',
    right: 'transform -translate-y-1/2',
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

    // 1. Determine the arrow's COLOR based on the tooltip's VARIANT.
    // For the 'light' variant, the background is 'bg-white', so the arrow must be 'white'.
    // For the 'dark' variant, the background is 'bg-gray-900', so the arrow must be 'gray-900'.
    const arrowColor = variant === 'light' ? 'white' : 'gray-900';

    // 2. Use the determined color in a single switch for the arrow's POSITION.
    // The `border-t-${arrowColor}` syntax uses Tailwind's JIT compiler to create the correct class,
    // e.g., 'border-t-white' or 'border-t-gray-900'.
        switch (position) {
      case 'top':
        return `${baseArrow} top-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-${arrowColor}`;
      case 'bottom':
        return `${baseArrow} bottom-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-${arrowColor}`;
      case 'left':
        return `${baseArrow} left-full top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-${arrowColor}`;
      case 'right':
        return `${baseArrow} right-full top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-${arrowColor}`;
    }
  };

  const tooltipElement = (
        <div
          className={cn(
        'fixed z-50 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
            'animate-in fade-in-0 zoom-in-95',
            getTooltipStyles(),
            positionClasses[position],
            className
          )}
          style={{
        top: `${tooltipPosition.top}px`,
        left: `${tooltipPosition.left}px`,
            maxWidth: '250px',
            whiteSpace: content.length > 30 ? 'normal' : 'nowrap'
          }}
        >
          {content}
          <div className={getArrowStyles()} />
        </div>
  );

  return (
    <>
      <div
        className="inline-block"
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
    </div>
      {isClient && isVisible && createPortal(tooltipElement, document.body)}
    </>
  );
}