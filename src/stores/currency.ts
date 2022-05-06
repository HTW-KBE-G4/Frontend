import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { api } from 'src/boot/axios';

export const predefinedCurrencies = ['USD', 'GBP', 'SEK', 'EUR', 'JPY'];

export const useCurrencyStore = defineStore('currency', {
  state: () => ({
    currency: 'EUR',
  }),

  getters: {},

  actions: {
    change(newCurrency: string) {
      this.currency = newCurrency;
    },

    getAll: async (): Promise<string[]> => {
      try {
        const response = await api.get<string[]>('currencies');
        return response.data;
      } catch (error) {
        Notify.create({
          type: 'info',
          message:
            'Available currencies could not be fetched. Predefining currencies...',
        });
        return predefinedCurrencies;
      }
    },
  },
});
