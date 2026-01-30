import { NavLink, useLocation } from 'react-router-dom';
import React from 'react';
import { 
  LayoutDashboard, 
  CreditCard, 
  ShoppingCart, 
  FileText, 
  User, 
  LogOut,
  Plane,
  X,
  ChevronLeft,
  Bell,
  Gift,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface MenuItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  showBadge?: boolean;
}

const userMenuItems: MenuItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/cartoes', label: 'Cartões', icon: CreditCard },
  { path: '/compras', label: 'Compras', icon: ShoppingCart },
  { path: '/notificacoes', label: 'Notificações', icon: Bell, showBadge: true },
  { path: '/promocoes', label: 'Promoções', icon: Gift },
  { path: '/relatorios', label: 'Relatórios', icon: FileText },
  { path: '/perfil', label: 'Perfil', icon: User },
];

const adminMenuItems: MenuItem[] = [
  { path: '/admin', label: 'Administração', icon: Shield },
];

export function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const { logout, user, isAdmin } = useAuth();
  const { unreadCount } = useUser();
  const location = useLocation();

  const menuItems = isAdmin 
    ? [...userMenuItems, ...adminMenuItems]
    : userMenuItems;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-sidebar z-50 flex flex-col transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
          <div className={cn("flex items-center gap-3", isCollapsed && "justify-center w-full")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Plane className="w-5 h-5 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold text-sidebar-foreground">MilesApp</span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden text-sidebar-foreground/70 hover:text-sidebar-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        {!isCollapsed && (
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
                <span className="text-sm font-medium text-sidebar-foreground">
                  {user?.nome?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.nome || 'Usuário'}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-sidebar-foreground/60 truncate">
                    {user?.email || ''}
                  </p>
                  {isAdmin && (
                    <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 bg-primary/10 text-primary border-primary/20">
                      Admin
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const showNotificationBadge = item.showBadge && unreadCount > 0;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  "sidebar-link relative",
                  isActive && "sidebar-link-active",
                  isCollapsed && "justify-center px-3"
                )}
              >
                <div className="relative">
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {showNotificationBadge && isCollapsed && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
                  )}
                </div>
                {!isCollapsed && (
                  <span className="flex-1">{item.label}</span>
                )}
                {showNotificationBadge && !isCollapsed && (
                  <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-5">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          {/* Collapse toggle - desktop only */}
          <button
            onClick={onToggleCollapse}
            className={cn(
              "hidden lg:flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-200",
              isCollapsed && "justify-center px-3"
            )}
          >
            <ChevronLeft className={cn(
              "w-5 h-5 transition-transform duration-200",
              isCollapsed && "rotate-180"
            )} />
            {!isCollapsed && <span>Recolher</span>}
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-all duration-200",
              isCollapsed && "justify-center px-3"
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
