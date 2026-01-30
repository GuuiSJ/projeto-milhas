import { format, formatDistanceToNow, parseISO, isAfter, isBefore, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Format currency to BRL
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// Format number with thousand separators
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

// Format points display
export function formatPoints(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return formatNumber(value);
}

// Format date to Brazilian format
export function formatDate(date: string | Date): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'dd/MM/yyyy', { locale: ptBR });
}

// Format date with time
export function formatDateTime(date: string | Date): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

// Get relative time (e.g., "há 2 dias")
export function getRelativeTime(date: string | Date): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(parsedDate, { addSuffix: true, locale: ptBR });
}

// Check if a date is expired
export function isExpired(date: string | Date): boolean {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return isBefore(parsedDate, new Date());
}

// Check if a date is expiring soon (within X days)
export function isExpiringSoon(date: string | Date, days: number = 7): boolean {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  const threshold = addDays(new Date(), days);
  return isAfter(parsedDate, new Date()) && isBefore(parsedDate, threshold);
}

// Get days until expiration
export function getDaysUntil(date: string | Date): number {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();
  const diffTime = parsedDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Get card brand icon name
export function getCardBrandIcon(brand: string): string {
  const brandMap: Record<string, string> = {
    'visa': 'visa',
    'mastercard': 'mastercard',
    'amex': 'amex',
    'elo': 'elo',
    'hipercard': 'hipercard',
  };
  return brandMap[brand.toLowerCase()] || 'credit-card';
}

// Get card gradient class based on brand
export function getCardGradient(brand: string): string {
  const gradientMap: Record<string, string> = {
    'visa': 'visa-gradient',
    'mastercard': 'mastercard-gradient',
    'amex': 'bg-gradient-to-br from-blue-500 to-blue-700',
    'elo': 'bg-gradient-to-br from-yellow-500 to-yellow-700',
    'hipercard': 'bg-gradient-to-br from-red-600 to-red-800',
  };
  return gradientMap[brand.toLowerCase()] || 'credit-card-gradient';
}

// Get status color classes
export function getStatusColor(status: string): { bg: string; text: string } {
  const statusMap: Record<string, { bg: string; text: string }> = {
    'pendente': { bg: 'bg-warning/10', text: 'text-warning' },
    'creditado': { bg: 'bg-success/10', text: 'text-success' },
    'expirado': { bg: 'bg-destructive/10', text: 'text-destructive' },
  };
  return statusMap[status.toLowerCase()] || { bg: 'bg-muted', text: 'text-muted-foreground' };
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
export function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: 'A senha deve ter pelo menos 8 caracteres' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'A senha deve conter pelo menos uma letra maiúscula' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'A senha deve conter pelo menos uma letra minúscula' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'A senha deve conter pelo menos um número' };
  }
  return { valid: true, message: 'Senha válida' };
}

// Truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Download file from blob
export function downloadFile(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

// Generate chart colors
export function getChartColors(count: number): string[] {
  const baseColors = [
    'hsl(221, 83%, 53%)',
    'hsl(172, 66%, 50%)',
    'hsl(262, 83%, 58%)',
    'hsl(38, 92%, 50%)',
    'hsl(0, 84%, 60%)',
    'hsl(280, 65%, 60%)',
    'hsl(190, 90%, 50%)',
  ];
  
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }
  return colors;
}
