import { Wifi, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPoints, getCardGradient } from '@/utils/helpers';

interface CreditCardDisplayProps {
  name: string;
  brand: string;
  lastDigits: string;
  program: string;
  points: number;
  expiryDate?: string;
  className?: string;
  onClick?: () => void;
}

export function CreditCardDisplay({
  name,
  brand,
  lastDigits,
  program,
  points,
  expiryDate = '12/28',
  className,
  onClick,
}: CreditCardDisplayProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative w-full aspect-[1.586/1] max-w-sm rounded-2xl p-6 text-primary-foreground overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
        getCardGradient(brand),
        className
      )}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-primary-foreground/20 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-primary-foreground/20 translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative h-full flex flex-col justify-between">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <Wifi className="w-8 h-8 rotate-90" />
          <button className="p-1 hover:bg-primary-foreground/10 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Card number */}
        <div className="space-y-2">
          <p className="text-lg tracking-[0.25em] font-mono">
            •••• •••• •••• {lastDigits}
          </p>
          <p className="text-sm opacity-80">{name}</p>
        </div>

        {/* Bottom row */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs opacity-70">Validade</p>
            <p className="text-sm font-medium">{expiryDate}</p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-70">{program}</p>
            <p className="text-lg font-bold">{formatPoints(points)} pts</p>
          </div>
        </div>

        {/* Brand logo placeholder */}
        <div className="absolute bottom-6 right-6">
          <div className="text-2xl font-bold uppercase opacity-30">
            {brand}
          </div>
        </div>
      </div>
    </div>
  );
}
