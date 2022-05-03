<template>
  <q-page>
    <div class="q-ma-sm q-gutter-md row">
      <GeneralCard
        :component="component"
        v-for="component in components"
        :key="component.id"
        v-bind="component"
        :name="component.productName"
        :image-url="component.imageUrl"
        :price="component.uvp"
        @click="showDetails(component.id)"
      ></GeneralCard>
      <div v-if="components.length === 0">No Components available 😥</div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Notify } from 'quasar';
import GeneralCard from 'components/GeneralCard.vue';
import { Component, componentApi } from 'src/api/component';
import { useCurrencyStore } from 'src/stores/currency';

const currencyStore = useCurrencyStore();
const componentList = ref<Component[]>([]);

/*const componentTestList = [
  {
    productName:
      'Extrem aktueller und cooler PC .. . .. .TEST OVERFLOW AHHHHHHHHHHHHHHHH AHHHHHHHHHHHHHHHH TEST TEST TEST',
    imageUrl:
      'https://cdn.pixabay.com/photo/2013/07/12/18/58/computer-154114_960_720.png',
    type: '',
    model: '',
    description: '',
    manufacturer: '',
    releaseDate: '',
    uvp: 114.99,
    weight: '',
    ean: '',
    id: 1,
  },
  {
    productName: 'Drucker  PC (+Exklusives Tinten-Abo für nur 39€/m)',
    uvp: 78.49,
    imageUrl:
      'https://cdn.pixabay.com/photo/2013/07/13/12/10/print-159336_960_720.png',
    type: '',
    model: '',
    description: '',
    manufacturer: '',
    releaseDate: '',
    weight: '',
    ean: '',
    id: 1,
  },
  {
    productName: 'Microsoft PC',
    id: 1,
    uvp: 999999999992.0,
    imageUrl:
      'https://cdn.pixabay.com/photo/2017/04/04/18/07/video-game-console-2202570_960_720.jpg',
    type: '',
    model: '',
    description: '',
    manufacturer: '',
    releaseDate: '',
    weight: '',
    ean: '',
  },
];*/

async function loadComponents(currency: string) {
  try {
    componentList.value = await componentApi.getAll(currency);
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Components could not be fetched',
    });
    //componentList.value = componentTestList;
  }
  return { products: componentList };
}

export default defineComponent({
  name: 'ProductsPage',
  components: { GeneralCard },

  methods: {
    showDetails(id: number) {
      //this.$router.push(`/components/${id.toString()}`)
      console.log('Showing details of component with the ID ' + id);
    },
  },

  async setup() {
    currencyStore.$subscribe((_mutation, state) => {
      loadComponents(state.currency);
    });

    loadComponents(currencyStore.currency);

    return { components: componentList };
  },
});
</script>
