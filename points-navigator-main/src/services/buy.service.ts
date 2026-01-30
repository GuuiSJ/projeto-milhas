import api from './api';
import type { Buy, BuyRequest } from '@/types/dtos';

export const buyService = {
  getAll: async (): Promise<Buy[]> => {
    const response = await api.get<Buy[]>('/compras');
    return response.data;
  },

  getById: async (id: string): Promise<Buy> => {
    const response = await api.get<Buy>(`/compras/${id}`);
    return response.data;
  },

  create: async (data: BuyRequest): Promise<Buy> => {
    const response = await api.post<Buy>('/compras', data);
    return response.data;
  },

  update: async (id: string, data: Partial<BuyRequest>): Promise<Buy> => {
    const response = await api.put<Buy>(`/compras/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/compras/${id}`);
  },

  uploadComprovante: async (id: string, file: File): Promise<Buy> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<Buy>(`/compras/${id}/upload-comprovante`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateStatus: async (id: string, status: Buy['status']): Promise<Buy> => {
    const response = await api.patch<Buy>(`/compras/${id}/status`, { status });
    return response.data;
  },
};
