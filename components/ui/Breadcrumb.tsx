import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn('flex items-center space-x-1 text-sm text-gray-500', className)}>
      <Link 
        href="/" 
        className="flex items-center hover:text-gray-700 transition-colors"
        title="Home"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight className="w-4 h-4" />
          {item.href && !item.current ? (
            <Link 
              href={item.href} 
              className="hover:text-gray-700 transition-colors"
              title={item.label}
            >
              {item.label}
            </Link>
          ) : (
            <span 
              className={cn(
                item.current ? 'text-gray-900 font-medium' : 'text-gray-500'
              )}
              title={item.label}
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}