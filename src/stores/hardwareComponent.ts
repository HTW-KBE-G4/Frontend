import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

export interface HardwareComponent {
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
    components: <HardwareComponent[]>[],
    isUpToDate: false,
    loadedCurrency: 'USD',
  }),

  getters: {},

  actions: {
    findComponent(id: number) {
      return this.components.find((component) => component.id === id);
    },

    async get(id: number, currency: string): Promise<HardwareComponent> {
      const component = this.findComponent(id);

      if (component && this.loadedCurrency === currency) {
        return component;
      } else {
        const url = `components/${id}/?currency=${currency}`;
        const response = await api.get<HardwareComponent>(url);
        this.$patch({
          loadedCurrency: currency,
        });
        return response.data as HardwareComponent;
      }
    },

    async getAll(currency: string): Promise<HardwareComponent[]> {
      if (this.isUpToDate && this.loadedCurrency === currency) {
        return this.components;
      } else {
        const url = `components/?currency=${currency}`;
        const response = await api.get<HardwareComponent[]>(url);
        this.$patch({
          components: response.data as HardwareComponent[],
          isUpToDate: true,
          loadedCurrency: currency,
        });
        return response.data as HardwareComponent[];
      }
    },
  },
});
