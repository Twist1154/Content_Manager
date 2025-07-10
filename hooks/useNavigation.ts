'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface NavigationState {
  canGoBack: boolean;
  currentPath: string;
  breadcrumbs: Array<{ label: string; href?: string; current?: boolean }>;
}

export function useNavigation(): NavigationState & {
  goBack: () => void;
  navigateTo: (path: string) => void;
} {
  const router = useRouter();
  const pathname = usePathname();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Check if we can go back by looking at the history
    setCanGoBack(window.history.length > 1);
  }, [pathname]);

  const generateBreadcrumbs = (path: string) => {
    const segments = path.split('/').filter(Boolean);
    const breadcrumbs = [];

    // Map common paths to user-friendly labels
    const pathLabels: Record<string, string> = {
      'dashboard': 'Dashboard',
      'admin': 'Admin Dashboard',
      'auth': 'Authentication',
      'client': 'Client',
      'signin': 'Sign In',
      'signup': 'Sign Up',
    };

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      
      breadcrumbs.push({
        label: pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
        href: isLast ? undefined : currentPath,
        current: isLast,
      });
    });

    return breadcrumbs;
  };

  const goBack = () => {
    router.back();
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return {
    canGoBack,
    currentPath: pathname,
    breadcrumbs: generateBreadcrumbs(pathname),
    goBack,
    navigateTo,
  };
}