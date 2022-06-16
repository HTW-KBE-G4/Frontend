<template>
  <q-dialog v-model="show" square persistent @shake="$router.back()">
    <q-card style="max-height: 90vh" v-if="component">
      <q-toolbar class="bg-accent text-white">
        <q-item-label class="text-h6"
          >{{ component.type }} Details</q-item-label
        >
        <q-space />
        <q-btn dense flat icon="arrow_back" @click="$router.back()" />
      </q-toolbar>
      <q-card-section>
        <q-img no-spinner width="50vh" :src="component.imageUrl"></q-img>
      </q-card-section>
      <q-card-section>
        <div class="text-h6">
          {{ component.productName }}
        </div></q-card-section
      >
      <q-card-section>
        <q-item-label class="text-subtitle2">Price:</q-item-label>
        <q-item-label class="text-positive">{{ formattedPrice }}</q-item-label>
      </q-card-section>
      <q-card-section>
        <q-item-label class="text-subtitle2">Description:</q-item-label>
        <q-item-label class="text-grey">{{
          component.description
        }}</q-item-label>
      </q-card-section>
      <q-card-section>
        <q-item-label class="text-subtitle2">Model:</q-item-label>
        <q-item-label class="text-grey">{{ component.model }}</q-item-label>
      </q-card-section>
      <q-card-section>
        <q-item-label class="text-subtitle2">Manufacturer:</q-item-label>
        <q-item-label class="text-grey">{{
          component.manufacturer
        }}</q-item-label>
      </q-card-section>
      <q-card-section>
        <q-item-label class="text-subtitle2">Release Date:</q-item-label>
        <q-item-label class="text-grey">{{
          component.releaseDate
        }}</q-item-label>
      </q-card-section>
      <q-card-section>
        <q-item-label class="text-subtitle2">Weight:</q-item-label>
        <q-item-label class="text-grey">{{ component.weight }}</q-item-label>
      </q-card-section>
      <q-card-section>
        <q-item-label class="text-subtitle2">EAN:</q-item-label>
        <q-item-label class="text-grey">{{ component.ean }}</q-item-label>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCurrencyStore } from 'src/stores/currency';
import {
  useComponentStore,
  HardwareComponent,
} from 'src/stores/hardwareComponent';
import { displayNotification } from 'src/utils';

const component = ref<HardwareComponent>();

export default defineComponent({
  name: 'DetailedComponent',

  async setup() {
    const route = useRoute();
    const router = useRouter();
    const currencyStore = useCurrencyStore();

    try {
      const id = parseInt(route.params.id as string);
      component.value = await useComponentStore().get(
        id,
        currencyStore.currency
      );
    } catch (error) {
      displayNotification('Hardware Component does not exist', true);
      router.back();
    }

    const formattedPrice = computed<string>(() =>
      currencyStore.formatPrice(component.value?.uvp || 0)
    );

    return {
      show: ref(true),
      component: component,
      formattedPrice,
    };
  },
});
</script>
