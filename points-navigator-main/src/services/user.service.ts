import api from './api';
import type { User, UpdateProfileRequest, ChangePasswordRequest } from '@/types/dtos';

export const userService = {
  getMe: async (): Promise<User> => {
    const response = await api.get<User>('/usuarios/me');
    return response.data;
  },

  updateMe: async (data: UpdateProfileRequest): Promise<User> => {
    const response = await api.put<User>('/usuarios/me', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await api.put('/usuarios/me/senha', data);
  },
};
