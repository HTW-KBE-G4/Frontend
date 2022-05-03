<template>
  <q-card class="general-card">
    <q-img no-spinner width="22vh" height="22vh" :src="imageUrl" />

    <q-card-section
      class="general-name row justify-center items-center text-center"
      >{{ name }}</q-card-section
    >

    <q-separator />
    <q-card-section class="general-price q-pt-sm text-positive"
      >{{ price }}
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

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
});
</script>

<style lang="scss">
.general-card {
  width: 100%;
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
  font-size: 2vh;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre;
}
</style>
