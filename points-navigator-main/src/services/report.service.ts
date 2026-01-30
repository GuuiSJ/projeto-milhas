import api from './api';
import type { ReportFilters } from '@/types/dtos';

export const reportService = {
  exportCSV: async (filters?: ReportFilters): Promise<Blob> => {
    const response = await api.get('/relatorios/movimentacoes/csv', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },

  exportPDF: async (filters?: ReportFilters): Promise<Blob> => {
    const response = await api.get('/relatorios/movimentacoes/pdf', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },

  downloadFile: (blob: Blob, filename: string): void => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
