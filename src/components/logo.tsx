import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        'flex items-center gap-2 text-foreground transition-colors hover:text-primary',
        className
      )}
    >
      <Leaf className="h-6 w-6" />
      <span className="font-headline text-xl font-bold">Harvest Haven</span>
    </Link>
  );
}
