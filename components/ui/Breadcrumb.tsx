'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';
import { fetchUserRole } from '@/app/actions/data-actions';

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
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);

        // Get user role using centralized function
        const result = await fetchUserRole(user.id);

        if (result.success) {
          setUserRole(result.role || 'client');
        } else {
          console.error('Error fetching user role:', result.error);
          setUserRole('client'); // Default fallback
        }
      }
    };

    getUser();
  }, [supabase]);

  const getHomeUrl = () => {
    if (!user) return '/';

    // Route based on user role
    if (userRole === 'admin') {
      return '/admin';
    } else {
      return '/dashboard';
    }
  };
  return (
    <nav className={cn('flex items-center space-x-1 text-sm text-gray-500', className)}>
      <Link 
        href={getHomeUrl()}
        className="flex items-center hover:text-gray-700 transition-colors"
        title={user ? (userRole === 'admin' ? 'Admin Dashboard' : 'Dashboard') : 'Home'}
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