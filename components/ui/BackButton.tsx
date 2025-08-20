'use client';

import { useRouter } from 'next/navigation';
import { Button } from './Button';
import { ArrowLeft } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export function BackButton({ href, label = 'Go back', className }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    // THEME: The Tooltip's 'dark' variant might look better as the default,
    // which will be theme-aware. This is an optional but recommended change.
    <Tooltip content={label}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleBack}
        // THEME: All hardcoded gray colors have been removed.
        // The `variant="outline"` now correctly applies the theme's border,
        // text, and hover colors automatically.
        // We keep `cn()` so you can still pass in layout classes (e.g., margins).
        className={cn(className)}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
    </Tooltip>
  );
}