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
      <q-card class="create-card row justify-center items-center no-box-shadow">
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
import { Notify } from 'quasar';
import GeneralCard from 'components/GeneralCard.vue';
import { Product, productApi } from 'src/api/product';
import { useCurrencyStore } from 'src/stores/currency';

const currencyStore = useCurrencyStore();
const productList = ref<Product[]>([]);

/*const productTestList = [
  {
    name: 'Extrem aktueller und cooler PC .. . .. .TEST OVERFLOW AHHHHHHHHHHHHHHHH AHHHHHHHHHHHHHHHH TEST TEST TEST',
    price: 114.99,
    imageUrl:
      'https://cdn.pixabay.com/photo/2013/07/12/18/58/computer-154114_960_720.png',
    id: 1,
    cpu_id: 1,
    gpu_id: 1,
    psu_id: 1,
    mb_id: 1,
    ram_id: 1,
    storage_id: 1,
  },
  {
    name: 'Drucker  PC (+Exklusives Tinten-Abo für nur 39€/m)',
    id: 1,
    cpu_id: 1,
    gpu_id: 1,
    psu_id: 1,
    mb_id: 1,
    ram_id: 1,
    storage_id: 1,
    price: 78.49,
    imageUrl:
      'https://cdn.pixabay.com/photo/2013/07/13/12/10/print-159336_960_720.png',
  },
  {
    name: 'Microsoft PC',
    id: 1,
    cpu_id: 1,
    gpu_id: 1,
    psu_id: 1,
    mb_id: 1,
    ram_id: 1,
    storage_id: 1,
    price: 999999999992.0,
    imageUrl:
      'https://cdn.pixabay.com/photo/2017/04/04/18/07/video-game-console-2202570_960_720.jpg',
  },
];*/

async function loadProducts(currency: string) {
  try {
    productList.value = await productApi.getAll(currency);
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Products could not be fetched',
    });
    //productList.value = productTestList;
  }
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
