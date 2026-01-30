import { useState } from 'react';
import { Bell, CheckCheck, AlertTriangle, Info, Gift, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const notificationIcons = {
  AVISO: Info,
  ALERTA: AlertTriangle,
  PROMOCAO: Gift,
};

const notificationStyles = {
  AVISO: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  ALERTA: 'bg-destructive/10 text-destructive border-destructive/20',
  PROMOCAO: 'bg-green-500/10 text-green-500 border-green-500/20',
};

export default function Notifications() {
  const { notifications, unreadCount, isLoadingNotifications, markAsRead, markAllAsRead, fetchNotifications } = useUser();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.lida)
    : notifications;

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Notificações</h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0 ? `${unreadCount} não lida(s)` : 'Todas lidas'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchNotifications()}
            disabled={isLoadingNotifications}
          >
            {isLoadingNotifications ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Atualizar'
            )}
          </Button>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Marcar todas como lidas
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          Todas ({notifications.length})
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('unread')}
        >
          Não lidas ({unreadCount})
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {isLoadingNotifications ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ) : filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground">Nenhuma notificação</h3>
              <p className="text-muted-foreground">
                {filter === 'unread' 
                  ? 'Todas as notificações foram lidas' 
                  : 'Você não tem notificações no momento'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => {
            const Icon = notificationIcons[notification.tipo];
            return (
              <Card 
                key={notification.id}
                className={cn(
                  "transition-all duration-200 cursor-pointer hover:shadow-md",
                  !notification.lida && "border-l-4 border-l-primary bg-primary/5"
                )}
                onClick={() => !notification.lida && handleMarkAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                      notificationStyles[notification.tipo]
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">
                          {notification.titulo}
                        </h3>
                        <Badge variant="outline" className={notificationStyles[notification.tipo]}>
                          {notification.tipo}
                        </Badge>
                        {!notification.lida && (
                          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {notification.mensagem}
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-2">
                        {formatDistanceToNow(new Date(notification.createdAt), { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
