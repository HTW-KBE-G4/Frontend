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
      <div v-if="components.length === 0" class="text-subtitle1">
        No Components available 😥
      </div>
    </div>
  </q-page>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Notify } from 'quasar';
import GeneralCard from 'components/GeneralCard.vue';
import { Component, componentApi } from 'src/api/component';
import { useCurrencyStore } from 'src/stores/currency';

const currencyStore = useCurrencyStore();
const componentList = ref<Component[]>([]);

async function loadComponents(currency: string) {
  try {
    componentList.value = await componentApi.getAll(currency);
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Components could not be fetched',
    });
  }
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

    return { components: componentList };
  },
});
</script>
