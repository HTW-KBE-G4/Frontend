<template>
  <q-page>
    <div class="q-ma-sm q-gutter-md row">
      <GeneralCard
        :product="product"
        v-for="product in products"
        :key="product.id"
        v-bind="product"
        :name="product.name"
        :image-url="product.imageUrl"
        :price="product.price"
        @click="showDetails(product.id)"
      ></GeneralCard>
      <div v-if="loading" class="text-subtitle1">
        <q-spinner-ball color="primary" size="2em" />
      </div>
      <q-card class="create-card row justify-center items-center no-box-shadow">
        <q-card-section class="text-center">
          <q-btn flat round class="create-button" @click="createProduct()">
            <q-icon color="grey" size="4em" name="control_point" />
          </q-btn>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Notify } from 'quasar';
import GeneralCard from 'components/GeneralCard.vue';
import { useCurrencyStore } from 'src/stores/currency';
import { useProductStore, Product } from 'src/stores/product';

const currencyStore = useCurrencyStore();
const productList = ref<Product[]>([]);
const isLoading = ref<boolean>(true);

async function loadProducts(currency: string) {
  try {
    productList.value = await useProductStore().getAll(currency);
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Products could not be fetched',
    });
  }
  isLoading.value = false;
  return { products: productList };
}

export default defineComponent({
  name: 'ProductsPage',
  components: { GeneralCard },

  methods: {
    createProduct() {
      //this.$router.push(create...);
      console.log('Creating a product');
    },
    showDetails(id: number) {
      this.$router.push(`/products/${id}`);
    },
  },

  async setup() {
    loadProducts(currencyStore.currency);

    currencyStore.$subscribe((_mutation, state) => {
      loadProducts(state.currency);
    });

    return { products: productList, loading: isLoading };
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
