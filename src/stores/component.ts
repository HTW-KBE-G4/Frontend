import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

export interface Component {
  id: number;
  type: string;
  model: string;
  description: string;
  manufacturer: string;
  releaseDate: string;
  uvp: number;
  weight: number;
  productName: string;
  ean: number;
  imageUrl: string;
}

export const useComponentStore = defineStore('components', {
  state: () => ({
    components: <Component[]>[],
    loadedCurrency: '',
  }),

  getters: {
    loaded(): boolean {
      return this.components.length != 0;
    },
  },

  actions: {
    findComponent(id: number) {
      return this.components.find((component) => component.id === id);
    },

    async get(id: number, currency?: string): Promise<Component> {
      let url = `components/${id}`;
      if (currency) {
        url += `/?currency=${currency}`;
      }

      const component = this.findComponent(id);

      if (component && this.loadedCurrency === currency) {
        return component;
      } else {
        const response = await api.get<Component>(url);
        this.$patch({
          loadedCurrency: currency,
        });
        return response.data;
      }
    },

    async getAll(currency?: string): Promise<Component[]> {
      let url = 'components';
      if (currency) {
        url += `/?currency=${currency}`;
      }
      if (this.loaded && this.loadedCurrency === currency) {
        return this.components;
      } else {
        const response = await api.get<Component[]>(url);
        this.$patch({
          components: response.data,
          loadedCurrency: currency,
        });
        return response.data;
      }
    },
  },
});
