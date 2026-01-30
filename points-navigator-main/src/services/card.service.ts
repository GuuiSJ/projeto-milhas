import api from './api';
import type { Card, CardRequest } from '@/types/dtos';

export const cardService = {
  getAll: async (): Promise<Card[]> => {
    const response = await api.get<Card[]>('/cartoes');
    return response.data;
  },

  getById: async (id: string): Promise<Card> => {
    const response = await api.get<Card>(`/cartoes/${id}`);
    return response.data;
  },

  create: async (data: CardRequest): Promise<Card> => {
    const response = await api.post<Card>('/cartoes', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CardRequest>): Promise<Card> => {
    const response = await api.put<Card>(`/cartoes/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/cartoes/${id}`);
  },
};
