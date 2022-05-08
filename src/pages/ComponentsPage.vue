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
      <div v-if="loading" class="text-subtitle1">
        <q-spinner-ball color="primary" size="2em" />
      </div>
    </div>
  </q-page>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Notify } from 'quasar';
import GeneralCard from 'components/GeneralCard.vue';
import { Component } from 'src/stores/component';
import { useCurrencyStore } from 'src/stores/currency';
import { useComponentStore } from 'src/stores/component';

const currencyStore = useCurrencyStore();
const componentList = ref<Component[]>([]);
const isLoading = ref<boolean>(true);

async function loadComponents(currency: string) {
  try {
    componentList.value = await useComponentStore().getAll(currency);
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Components could not be fetched',
    });
  }
  isLoading.value = false;
  return { products: componentList };
}

export default defineComponent({
  name: 'ProductsPage',
  components: { GeneralCard },

  methods: {
    showDetails(id: number) {
      this.$router.push(`/components/${id}`);
    },
  },

  async setup() {
    loadComponents(currencyStore.currency);

    currencyStore.$subscribe((_mutation, state) => {
      loadComponents(state.currency);
    });

    return { components: componentList, loading: isLoading };
  },
});
</script>
