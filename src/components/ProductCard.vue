<template>
  <q-card class="product-card">
    <q-img no-spinner width="22vh" height="22vh" :src="product.imageUrl" />

    <q-card-section
      class="product-name row justify-center items-center text-center"
      >{{ product.name }}</q-card-section
    >

    <q-separator />
    <q-card-section class="product-price q-pt-sm text-positive"
      >{{ product.price }}
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { Product } from 'src/api/product';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'ProductCard',
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true,
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
