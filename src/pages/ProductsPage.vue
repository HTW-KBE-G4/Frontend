<template>
  <q-page>
    <div class="q-ma-sm q-gutter-md row">
      <ProductCard
        :product="product"
        v-for="product in products"
        :key="product.id"
        v-bind="product"
        @click="showDetails(product.id)"
      ></ProductCard>
      <q-card
        @currency-change="createProduct"
        class="create-card row justify-center items-center no-box-shadow"
      >
        <q-card-section class="text-center">
          <q-btn flat round class="create-button" @click="createProduct()">
            <q-icon color="grey" size="4em" name="control_point" />
          </q-btn>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import ProductCard from 'components/ProductCard.vue';
import { Product, productApi } from 'src/api/product';
import { Notify } from 'quasar';
import { useCurrencyStore } from 'src/stores/currency';

const currencyStore = useCurrencyStore();
const productList = ref<Product[]>([]);

async function loadProducts(currency: string) {
  try {
    productList.value = await productApi.getAll(currency);
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Products could not be fetched',
    });
  }
  return { products: productList };
}

export default defineComponent({
  name: 'ProductsPage',
  components: { ProductCard },

  methods: {
    createProduct() {
      //this.$router.push(create...);
      console.log('Creating a product');
    },
    showDetails(id: number) {
      //this.$router.push(`/products/${id.toString()}`)
      console.log('Showing details of product with the ID ' + id);
    },
  },

  async setup() {
    currencyStore.$subscribe((_mutation, state) => {
      loadProducts(state.currency);
    });

    loadProducts(currencyStore.currency);

    return { products: productList };
  },
});
</script>

<style lang="scss">
.create-card {
  opacity: 0.3;
  outline-color: grey;
  outline-style: dashed;
  width: 22vh;
  height: 38vh;
}
</style>
