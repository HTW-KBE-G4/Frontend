<template>
  <q-dialog v-model="show" persistent square @shake="$router.push('/products')"
    ><q-card style="max-width: 75vh" v-if="product">
      <q-toolbar class="bg-accent text-white">
        <q-item-label class="text-subtitle1">{{ product.name }} </q-item-label>
        <q-space />
        <q-btn dense flat icon="close" @click="$router.push('/products')" />
      </q-toolbar>
      <div class="q-ma-sm q-gutter-md row">
        <q-card-section class="text-h5" horizontal style="width: 100%">
          <div class="q-mr-md">Total:</div>
          <div class="text-positive">{{ formattedPrice }}</div>
        </q-card-section>
        <GeneralCard
          v-for="component in product.components"
          :key="component.id"
          :name="component.productName"
          :image-url="component.imageUrl"
          :price="component.uvp"
          @click="showDetails(product!.id, component.id)"
        ></GeneralCard>
      </div>
    </q-card>
  </q-dialog>
  <router-view></router-view>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import GeneralCard from './GeneralCard.vue';
import { useRoute, useRouter } from 'vue-router';
import { useCurrencyStore } from 'src/stores/currency';
import { Notify } from 'quasar';
import { useProductStore, Product } from 'src/stores/product';

const product = ref<Product>();

export default defineComponent({
  name: 'DetailedProduct',
  methods: {
    showDetails(productId: number, componentId: number) {
      this.$router.push(`${productId}/components/${componentId}`);
    },
  },
  async setup() {
    const route = useRoute();
    const router = useRouter();
    const currencyStore = useCurrencyStore();

    try {
      const id = parseInt(route.params.id as string);
      product.value = await useProductStore().get(id, currencyStore.currency);
    } catch (error) {
      Notify.create({
        type: 'negative',
        message: 'Product could not be loaded or does not exist',
      });
      router.push('/products');
    }

    const formattedPrice = computed<string>(() =>
      currencyStore.formatPrice(product.value?.price || 0)
    );

    return {
      show: ref(true),
      product: product,
      formattedPrice,
    };
  },
  components: { GeneralCard },
});
</script>
