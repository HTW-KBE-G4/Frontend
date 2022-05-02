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
import { defineComponent, ref } from 'vue';
import ProductCard from 'components/ProductCard.vue';
import { Product, productApi } from 'src/api/product';
import { Notify } from 'quasar';

const productList = ref<Product[]>([]);

export default defineComponent({
  name: 'ProductsPage',
  components: { ProductCard },

  methods: {
    createProduct() {
      //this.$router.push(create...);
      console.log('Creating a product');
    },
    showDetails(id: number) {
      //TODO: this.$router.push(`/products/${id.toString()}`)
      console.log('Showing details of product with the ID ' + id);
    },
  },

  async setup() {
    // Call in main scripts body to only load once?
    try {
      productList.value = await productApi.getAll();
    } catch (error) {
      Notify.create({
        type: 'negative',
        message: 'Products could not be fetched',
      });
    }
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
