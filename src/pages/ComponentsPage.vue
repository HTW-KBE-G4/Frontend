<template>
  <q-page>
    <div class="q-ma-sm q-gutter-md row">
      <GeneralCard
        v-for="component in components"
        :key="component.component_id"
        :name="component.productName"
        :image-url="component.imageUrl"
        :price="component.uvp"
        @click="showDetails(component.component_id)"
      ></GeneralCard>
      <div
        v-if="components.length === 0 && !loading"
        class="q-mr-md text-subtitle1"
      >
        No hardware components available 😢
      </div>
      <div v-if="loading" class="text-subtitle1">
        <q-spinner-ball color="primary" size="2em" />
      </div>
    </div>
  </q-page>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import GeneralCard from 'components/GeneralCard.vue';
import { useCurrencyStore } from 'src/stores/currency';
import { useComponentStore } from 'src/stores/hardwareComponent';
import { displayNotification } from 'src/utils';

const currencyStore = useCurrencyStore();
const isLoading = ref<boolean>(true);

async function loadComponents(currency: string) {
  try {
    await useComponentStore().getAll(currency);
  } catch (error) {
    displayNotification('Hardware components could not be fetched', true);
  }
  isLoading.value = false;
}

export default defineComponent({
  name: 'ComponentsPage',
  components: { GeneralCard },
  computed: {
    components() {
      return useComponentStore().$state.components;
    },
  },
  methods: {
    showDetails(id: number) {
      this.$router.push(`/components/${id}`);
    },
  },

  async setup() {
    loadComponents(currencyStore.currency);

    watch(
      () => currencyStore.$state.currency,
      (newCurrency) => {
        loadComponents(newCurrency);
      }
    );

    return { loading: isLoading };
  },
});
</script>
