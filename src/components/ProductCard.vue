<template>
  <q-card class="product-card">
    <q-img no-spinner width="200px" height="200px" :src="image" />
    <q-card-section class="product-name text-center">{{ name }}</q-card-section>
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
  //TODO: Adjust in the future for smartphone responsiveness?
  width: 100%;
  max-width: 200px;
  max-height: 350px;
}

.product-name {
  //TODO: Adjust in the future for smartphone responsiveness?
  height: 100px;
  padding: 20px;
  font-size: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-flex;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-price {
  float: right;
  font-size: 150%;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
