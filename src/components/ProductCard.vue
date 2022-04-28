<template>
  <q-card class="product-card">
    <q-img no-spinner width="22vh" height="22vh" :src="image" />

    <q-card-section
      class="product-name row justify-center items-center text-center"
      >{{ name }}</q-card-section
    >

    <q-separator />
    <q-card-section class="product-price q-pt-sm text-positive"
      >{{ price }}
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ProductCard',
  // Hardcoded (will be changed later) -> TODO: Interfaces
  props: {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
  },
});
</script>

<style lang="scss">
.product-card {
  width: 100%;
  max-width: 22vh;
  max-height: 38vh;
}

.product-name {
  height: 10vh;
  padding: 2vh;
  overflow: hidden visible;
}

.product-price {
  text-align: right;
  padding: 1.5vh;
  font-size: 2vh;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre;
}
</style>
