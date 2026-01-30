import api from './api';
import type { DashboardData } from '@/types/dtos';

export const dashboardService = {
  getData: async (): Promise<DashboardData> => {
    const response = await api.get<DashboardData>('/dashboard');
    return response.data;
  },
};
