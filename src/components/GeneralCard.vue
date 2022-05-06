<template>
  <q-card class="general-card" square>
    <q-img no-spinner width="22vh" height="22vh" :src="imageUrl" />
    <q-card-section
      class="general-name row justify-center items-center text-center"
      >{{ name }}</q-card-section
    >
    <q-separator />
    <q-card-section class="general-price q-pt-sm text-positive"
      >{{ price }} {{ currency }}
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { useCurrencyStore } from 'src/stores/currency';
import { defineComponent, ref } from 'vue';

const currencyStore = useCurrencyStore();
const updatableCurrency = ref<string>(currencyStore.currency);

export default defineComponent({
  name: 'GeneralCard',
  props: {
    name: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },

  setup() {
    currencyStore.$subscribe((_mutation, state) => {
      updatableCurrency.value = state.currency;
    });
    return {
      currency: updatableCurrency,
    };
  },
});
</script>

<style lang="scss">
.general-card {
  max-width: 22vh;
  max-height: 38vh;
}

.general-name {
  height: 10vh;
  padding: 2vh;
  overflow: hidden visible;
}

.general-price {
  text-align: right;
  padding: 1.5vh;
  font-size: 1.8vh;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre;
}
</style>
