<template>
  <q-card
    v-ripple.early.center="{ color: 'blue' }"
    inset-shadow-down
    class="general-card"
  >
    <q-img no-spinner width="22vh" height="22vh" :src="imageUrl" />
    <q-card-section
      class="general-name row justify-center items-center text-center"
      >{{ name }}</q-card-section
    >
    <q-separator />
    <q-card-section class="general-price q-pt-sm text-positive"
      >{{ formattedPrice }}
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { computed } from '@vue/reactivity';
import { useCurrencyStore } from 'src/stores/currency';
import { defineComponent } from 'vue';

const currencyStore = useCurrencyStore();

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
  setup(props) {
    const formattedPrice = computed<string>(() =>
      currencyStore.formatPrice(props.price)
    );
    return {
      formattedPrice,
    };
  },
});
</script>

<style lang="scss">
.general-card {
  max-width: 22vh;
  max-height: 38vh;
  box-shadow: 2px 4px 12px rgb(0, 0, 0, 0.2);
  border-radius: 12px;
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
