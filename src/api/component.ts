import { api } from 'src/boot/axios';

export interface Component {
  id: number;
  type: string;
  model: string;
  description: string;
  manufacturer: string;
  releaseDate: string;
  uvp: number;
  weight: string;
  productName: string;
  ean: string;
  imageUrl: string;
}

export const componentApi = {
  get: async (id: number, currency?: string): Promise<Component> => {
    let url = `components/${id}`;
    if (currency) {
      url += `/?currency=${currency}`;
    }
    const response = await api.get<Component>(url);
    return response.data;
  },

  getAll: async (currency?: string): Promise<Component[]> => {
    let url = 'components';
    if (currency) {
      url += `/?currency=${currency}`;
    }
    const response = await api.get<Component[]>(url);
    return response.data;
  },
};
