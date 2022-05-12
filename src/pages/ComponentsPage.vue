<template>
  <q-page>
    <div class="q-ma-sm q-gutter-md row">
      <GeneralCard
        v-for="component in components"
        :key="component.id"
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
import { useCurrencyStore } from 'src/stores/currency';
import { useComponentStore } from 'src/stores/component';

const currencyStore = useCurrencyStore();
const isLoading = ref<boolean>(true);

async function loadComponents(currency: string) {
  try {
    await useComponentStore().getAll(currency);
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Components could not be fetched',
    });
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

    currencyStore.$subscribe((_mutation, state) => {
      loadComponents(state.currency);
    });

    return { loading: isLoading };
  },
});
</script>
