'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
          {
            'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md': variant === 'default',
            'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 border border-gray-200': variant === 'secondary',
            'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 shadow-sm': variant === 'outline',
            'text-gray-700 hover:bg-gray-100 active:bg-gray-200': variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm hover:shadow-md': variant === 'destructive',
          },
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };