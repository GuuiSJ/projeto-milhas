import api from './api';
import type { Promotion } from '@/types/dtos';

export const promotionService = {
  getAll: async (): Promise<Promotion[]> => {
    const response = await api.get<Promotion[]>('/promocoes');
    return response.data;
  },

  getActive: async (): Promise<Promotion[]> => {
    const response = await api.get<Promotion[]>('/promocoes/ativas');
    return response.data;
  },

  getById: async (id: string): Promise<Promotion> => {
    const response = await api.get<Promotion>(`/promocoes/${id}`);
    return response.data;
  },
};
