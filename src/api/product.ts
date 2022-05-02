import { api } from 'src/boot/axios';

export interface Product {
  id: number;
  name: string;
  cpu_id: number;
  gpu_id: number;
  psu_id: number;
  mb_id: number;
  ram_id: number;
  storage_id: number;

  price: number;
  imageUrl: string;
}

export const productApi = {
  create: async (product: Product): Promise<unknown> => {
    const response = await api.post<Product[]>('products/create', product);
    return response.data;
  },

  get: async (id: number, currency?: string): Promise<Product> => {
    let url = `products/${id}`;
    if (currency) {
      url += `/?currency=${currency}`;
    }
    const response = await api.get<Product>(url);
    return response.data;
  },

  getAll: async (currency?: string): Promise<Product[]> => {
    let url = 'products';
    if (currency) {
      url += `/?currency=${currency}`;
    }
    const response = await api.get<Product[]>(url);
    return response.data;
  },
};
