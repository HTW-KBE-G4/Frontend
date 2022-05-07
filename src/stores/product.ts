import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { Component } from './component';

export interface Product {
  id: number;
  name: string;
  components: Component[];
  price: number;
  imageUrl: string;
}

export const useProductStore = defineStore('products', {
  state: () => ({
    products: <Product[]>[],
    loadedCurrency: '',
  }),

  getters: {
    loaded(): boolean {
      return this.products.length != 0;
    },
  },

  actions: {
    findProduct(id: number) {
      return this.products.find((product) => product.id === id);
    },

    async create(product: Product): Promise<unknown> {
      const response = await api.post<Product[]>('products/create', product);
      return response.data;
    },

    async get(id: number, currency?: string): Promise<Product> {
      let url = `products/${id}`;
      if (currency) {
        url += `/?currency=${currency}`;
      }
      const product = this.findProduct(id);

      if (product && this.loadedCurrency === currency) {
        return product;
      } else {
        const response = await api.get<Product>(url);
        this.$patch({
          loadedCurrency: currency,
        });
        return response.data;
      }
    },

    async getAll(currency?: string): Promise<Product[]> {
      let url = 'products';
      if (currency) {
        url += `/?currency=${currency}`;
      }

      if (this.loaded && this.loadedCurrency === currency) {
        return this.products;
      } else {
        const response = await api.get<Product[]>(url);
        this.$patch({
          products: response.data,
          loadedCurrency: currency,
        });
        return response.data;
      }
    },
  },
});
