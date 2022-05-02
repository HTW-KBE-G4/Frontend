import { defineStore } from 'pinia';

export interface Component {
  id: number;
  type: string;
  model: string;
  description: string;
  manufacturer: string;
  releaseDate: string;
  uvp: string;
  weight: string;
  productName: string;
  ean: string;
  imageURL: string;
}

export const useComponentStore = defineStore('components', {
  state: () => ({
    components: <Component[]>[],
  }),

  getters: {},

  actions: {},
});
