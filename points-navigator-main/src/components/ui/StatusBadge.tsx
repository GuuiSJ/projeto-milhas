import { cn } from '@/lib/utils';
import { getStatusColor } from '@/utils/helpers';

interface StatusBadgeProps {
  status: 'pendente' | 'creditado' | 'expirado';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { bg, text } = getStatusColor(status);
  
  const labels = {
    pendente: 'Pendente',
    creditado: 'Creditado',
    expirado: 'Expirado',
  };

  return (
    <span className={cn(
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
      bg,
      text,
      className
    )}>
      {labels[status]}
    </span>
  );
}
