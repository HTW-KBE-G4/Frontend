<template>
  <q-page data-cy="products-page"
    ><div class="q-pa-sm" v-if="product">
      <q-toolbar>
        <q-btn
          class="elevated"
          rounded
          flat
          icon="arrow_back"
          @click="$router.back()"
        ></q-btn>
      </q-toolbar>
      <q-card-section horizontal>
        <div class="q-ma-md">
          <div flat class="title">
            <a class="text-h3">
              {{ product.name }}
            </a>
          </div>
          <q-card-section>
            <q-img no-spinner width="50vh" :src="product.image_url"></q-img>
          </q-card-section>
          <div class="title q-pa-md text-h5">
            Total Price: <a class="text-positive">{{ formattedPrice }}</a>
          </div>
        </div>
        <div class="q-mt-md">
          <div class="text-h5 q-ma-md title">Components:</div>
          <q-card-section
            data-cy="product-components"
            style="max-height: 60vh; max-width: max-content"
            class="q-gutter-sm q-mt-sm row scroll"
          >
            <GeneralCard
              v-for="component in product.components"
              :key="component.component_id"
              :name="component.productName"
              :image-u-r-l="component.imageURL"
              :price="component.uvp"
              @click="showDetails(product!.product_id, component.component_id)"
            ></GeneralCard>
          </q-card-section>
        </div>
      </q-card-section>
    </div>
  </q-page>
  <router-view></router-view>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import GeneralCard from './GeneralCard.vue';
import { useRoute, useRouter } from 'vue-router';
import { useCurrencyStore } from 'src/stores/currency';
import { useProductStore, Product } from 'src/stores/product';
import { displayNotification } from 'src/utils';

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
      const id = parseInt(route.params.product_id as string);
      product.value = await useProductStore().get(id, currencyStore.currency);
    } catch (error) {
      displayNotification(
        'Product could not be loaded or does not exist',
        true
      );
      router.push('/products');
    }

    const formattedPrice = computed<string>(() =>
      currencyStore.formatPrice(product.value?.uvp || 0)
    );

    return {
      product: product,
      formattedPrice,
    };
  },
  components: { GeneralCard },
});
</script>

<style lang="scss">
.elevated {
  width: fit-content;
  height: fit-content;
  margin: 1vh;
  padding: 2vh;
  box-shadow: 0px 0px 40px 1px rgb(0, 0, 0, 0.2);
  border-radius: 20px;
}
.title {
  margin: auto;
  text-align: center;
  max-width: fit-content;
  max-height: fit-content;
  padding: 1vh;
  border-radius: 14px;
}
</style>
