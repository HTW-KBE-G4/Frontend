<template>
  <q-dialog
    transition-show="fade"
    v-model="show"
    persistent
    @shake="$router.back()"
  >
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
      <q-card-section class="text-center">
        <a class="text-h4">
          {{ component.productName }}
        </a></q-card-section
      >
      <q-separator inset />
      <q-card-section>
        <q-item-label class="property"
          >Price:
          <a class="text-positive">{{ formattedPrice }}</a></q-item-label
        >
      </q-card-section>
      <q-card-section>
        <q-item-label class="property"
          >Description:
          <a class="value">{{ component.description }}</a></q-item-label
        >
      </q-card-section>
      <q-card-section>
        <q-item-label class="property"
          >Model: <a class="value">{{ component.model }}</a></q-item-label
        >
      </q-card-section>
      <q-card-section>
        <q-item-label class="property"
          >Manufacturer:
          <a class="value">{{ component.manufacturer }}</a></q-item-label
        >
      </q-card-section>
      <q-card-section>
        <q-item-label class="property"
          >Release Date:
          <a class="value">{{ component.releaseDate }}</a></q-item-label
        >
      </q-card-section>
      <q-card-section>
        <q-item-label class="property"
          >Weight: <a class="value">{{ component.weight }}</a></q-item-label
        >
      </q-card-section>
      <q-card-section>
        <q-item-label class="property"
          >EAN: <a class="value">{{ component.ean }}</a></q-item-label
        >
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
      const id = parseInt(route.params.component_id as string);
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

<style lang="scss">
.property {
  font-size: medium;
  font-weight: 450;
}
.value {
  font-weight: normal;
  color: grey;
}
</style>
