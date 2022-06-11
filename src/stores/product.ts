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
    isUpToDate: false,
    loadedCurrency: '',
  }),

  getters: {},

  actions: {
    findProduct(id: number) {
      return this.products.find((product) => product.id === id);
    },

    async create(name: string, components: HardwareComponent[]) {
      const data = { name: name, components: components };
      await api.post('products/create', data).then(async () => {
        this.isUpToDate = false;
        await this.getAll(this.loadedCurrency);
      });
    },

    async get(id: number, currency: string): Promise<Product> {
      const url = `products/${id}/?currency=${currency}`;
      const product = this.findProduct(id);

      if (product && this.loadedCurrency === currency) {
        return product;
      } else {
        const response = await api.get<Product>(url);
        this.$patch({
          loadedCurrency: currency,
        });
        return response.data as Product;
      }
    },

    async getAll(currency: string): Promise<Product[]> {
      const url = `products/?currency=${currency}`;

      if (this.isUpToDate && this.loadedCurrency === currency) {
        return this.products;
      } else {
        const response = await api.get<Product[]>(url);
        this.$patch({
          products: response.data,
          isUpToDate: true,
          loadedCurrency: currency,
        });
        return response.data as Product[];
      }
    },
  },
});
