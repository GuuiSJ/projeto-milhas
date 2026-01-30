import api from './api';
import type { Notification } from '@/types/dtos';

export const notificationService = {
  getAll: async (): Promise<Notification[]> => {
    const response = await api.get<Notification[]>('/notificacoes');
    return response.data;
  },

  markAsRead: async (id: string): Promise<Notification> => {
    const response = await api.patch<Notification>(`/notificacoes/${id}/lida`);
    return response.data;
  },

  markAllAsRead: async (): Promise<void> => {
    await api.patch('/notificacoes/todas-lidas');
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await api.get<{ count: number }>('/notificacoes/nao-lidas/count');
    return response.data.count;
  },
};
