import { Menu, Bell, Search } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
}

export function Navbar({ onMenuClick, sidebarCollapsed }: NavbarProps) {
  const { user } = useAuth();
  const [hasNotifications] = useState(true);

  return (
    <header 
      className={cn(
        "fixed top-0 right-0 h-16 bg-card/80 backdrop-blur-xl border-b border-border z-30 flex items-center justify-between px-4 md:px-6 transition-all duration-300",
        sidebarCollapsed ? "left-0 lg:left-20" : "left-0 lg:left-64"
      )}
    >
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-muted rounded-lg px-4 py-2 w-64">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
          {hasNotifications && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
          )}
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-foreground">{user?.nome || 'Usuário'}</p>
            <p className="text-xs text-muted-foreground">Premium</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {user?.nome?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
