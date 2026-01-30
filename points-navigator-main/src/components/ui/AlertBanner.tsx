import { AlertTriangle, X, Clock, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertBannerProps {
  type: 'warning' | 'error' | 'success' | 'info';
  title: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export function AlertBanner({ type, title, message, onDismiss, className }: AlertBannerProps) {
  const styles = {
    warning: {
      bg: 'bg-warning/10 border-warning/20',
      icon: Clock,
      iconColor: 'text-warning',
    },
    error: {
      bg: 'bg-destructive/10 border-destructive/20',
      icon: AlertTriangle,
      iconColor: 'text-destructive',
    },
    success: {
      bg: 'bg-success/10 border-success/20',
      icon: CheckCircle,
      iconColor: 'text-success',
    },
    info: {
      bg: 'bg-primary/10 border-primary/20',
      icon: Info,
      iconColor: 'text-primary',
    },
  };

  const { bg, icon: Icon, iconColor } = styles[type];

  return (
    <div className={cn(
      "flex items-start gap-4 p-4 rounded-xl border animate-slide-up",
      bg,
      className
    )}>
      <div className={cn("mt-0.5", iconColor)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground mt-1">{message}</p>
      </div>
      {onDismiss && (
        <button 
          onClick={onDismiss}
          className="p-1 hover:bg-foreground/5 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}
