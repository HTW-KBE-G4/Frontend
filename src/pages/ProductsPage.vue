<template>
  <q-page>
    <div class="q-ma-sm q-gutter-md row">
      <GeneralCard
        v-for="product in products"
        :key="product.id"
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
import { defineComponent, ref, watch } from 'vue';
import GeneralCard from 'components/GeneralCard.vue';
import { useCurrencyStore } from 'src/stores/currency';
import { useProductStore } from 'src/stores/product';
import { displayNotification } from 'src/utils';

const currencyStore = useCurrencyStore();
const isLoading = ref<boolean>(true);

async function loadProducts(currency: string) {
  try {
    await useProductStore().getAll(currency);
  } catch (error) {
    displayNotification('Products could not be fetched', true);
  }
  isLoading.value = false;
}

export default defineComponent({
  name: 'ProductsPage',
  components: { GeneralCard },
  computed: {
    products() {
      return useProductStore().$state.products;
    },
  },

  methods: {
    createProduct() {
      this.$router.push('/products/create');
    },
    showDetails(id: number) {
      this.$router.push(`/products/${id}`);
    },
  },

  async setup() {
    loadProducts(currencyStore.currency);

    watch(
      () => currencyStore.$state.currency,
      (newCurrency) => {
        loadProducts(newCurrency);
      }
    );

    return { loading: isLoading };
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
