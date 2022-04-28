<template>
  <q-page>
    <div class="q-ma-sm q-gutter-md row">
      <ProductCard
        v-for="product in products"
        :key="product.name"
        v-bind="product"
      ></ProductCard>
      <q-card class="create-card row justify-center items-center no-box-shadow">
        <q-card-section class="text-center">
          <q-btn flat round class="create-button" @click="createProduct">
            <q-icon color="grey" size="4em" name="control_point" />
          </q-btn>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ProductCard from 'components/ProductCard.vue';

const productList = [
  {
    name: 'Extrem aktueller und cooler PC .. . .. .TEST OVERFLOW AHHHHHHHHHHHHHHHH AHHHHHHHHHHHHHHHH TEST TEST TEST',
    price: '114,99 €',
    image:
      'https://cdn.pixabay.com/photo/2013/07/12/18/58/computer-154114_960_720.png',
  },
  {
    name: 'Drucker  PC (+Exklusives Tinten-Abo für nur 39€/m)',
    price: '78,49 €',
    image:
      'https://cdn.pixabay.com/photo/2013/07/13/12/10/print-159336_960_720.png',
  },
  {
    name: 'Microsoft PC',
    price: '999999999992,00 €',
    image:
      'https://cdn.pixabay.com/photo/2017/04/04/18/07/video-game-console-2202570_960_720.jpg',
  },
];

export default defineComponent({
  name: 'ProductsPage',
  components: { ProductCard },

  methods: {
    createProduct() {
      //this.$router.push(create...);
      console.log('Creating a product');
    },
  },

  setup() {
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
