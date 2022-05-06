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
        <q-item-label class="text-positive"
          >{{ component.uvp }} {{ currency }}</q-item-label
        >
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
import { Notify } from 'quasar';
import { Component, componentApi } from 'src/api/component';
import { defineComponent, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCurrencyStore } from 'src/stores/currency';

const component = ref<Component>();

export default defineComponent({
  name: 'DetailedComponent',

  async setup() {
    const route = useRoute();
    const router = useRouter();
    const currencyStore = useCurrencyStore();

    try {
      const id = parseInt(route.params.id as string);
      component.value = await componentApi.get(id, currencyStore.currency);
    } catch (error) {
      Notify.create({
        type: 'negative',
        message: 'Component could not be loaded or does not exist',
      });
      router.push('/components');
    }

    return {
      show: ref(true),
      component: component,
      currency: currencyStore.currency,
    };
  },
});
</script>
