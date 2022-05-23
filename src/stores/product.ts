import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { HardwareComponent } from './hardwareComponent';

export interface Product {
  id: number;
  name: string;
  components: HardwareComponent[];
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

    async create(components: HardwareComponent[]): Promise<unknown> {
      // ? local storage
      const response = await api.post('products/create', components);
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
