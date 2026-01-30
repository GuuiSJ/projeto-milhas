import api from './api';
import type { 
  Bandeira, 
  BandeiraRequest, 
  ProgramaPontos, 
  ProgramaPontosRequest 
} from '@/types/dtos';

export const adminService = {
  // Bandeiras
  bandeiras: {
    getAll: async (): Promise<Bandeira[]> => {
      const response = await api.get<Bandeira[]>('/admin/bandeiras');
      return response.data;
    },

    getById: async (id: string): Promise<Bandeira> => {
      const response = await api.get<Bandeira>(`/admin/bandeiras/${id}`);
      return response.data;
    },

    create: async (data: BandeiraRequest): Promise<Bandeira> => {
      const response = await api.post<Bandeira>('/admin/bandeiras', data);
      return response.data;
    },

    update: async (id: string, data: BandeiraRequest): Promise<Bandeira> => {
      const response = await api.put<Bandeira>(`/admin/bandeiras/${id}`, data);
      return response.data;
    },

    delete: async (id: string): Promise<void> => {
      await api.delete(`/admin/bandeiras/${id}`);
    },
  },

  // Programas de Pontos
  programas: {
    getAll: async (): Promise<ProgramaPontos[]> => {
      const response = await api.get<ProgramaPontos[]>('/admin/programas');
      return response.data;
    },

    getById: async (id: string): Promise<ProgramaPontos> => {
      const response = await api.get<ProgramaPontos>(`/admin/programas/${id}`);
      return response.data;
    },

    create: async (data: ProgramaPontosRequest): Promise<ProgramaPontos> => {
      const response = await api.post<ProgramaPontos>('/admin/programas', data);
      return response.data;
    },

    update: async (id: string, data: ProgramaPontosRequest): Promise<ProgramaPontos> => {
      const response = await api.put<ProgramaPontos>(`/admin/programas/${id}`, data);
      return response.data;
    },

    delete: async (id: string): Promise<void> => {
      await api.delete(`/admin/programas/${id}`);
    },
  },
};
