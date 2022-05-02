import { api } from 'src/boot/axios';

export const currencyApi = {
  // Only if needed (if curriencies won't be hardcoded)
  getAll: async (): Promise<string[]> => {
    const response = await api.get<string[]>('currencies');
    return response.data;
  },
};
