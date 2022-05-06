import { api } from 'src/boot/axios';
import { Component } from './component';

export interface Product {
  id: number;
  name: string;
  components: Component[];
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
