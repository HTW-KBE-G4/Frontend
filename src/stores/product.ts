import { defineStore } from 'pinia';

export interface Product {
  id: number;
  name: string;
  cpu_id: number;
  gpu_id: number;
  psu_id: number;
  mb_id: number;
  ram_id: number;
  storage_id: number;
}

export const useProductStore = defineStore('products', {
  state: () => ({
    products: <Product[]>[],
  }),

  getters: {},

  actions: {},
});
