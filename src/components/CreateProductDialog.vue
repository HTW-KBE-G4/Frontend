<template>
  <q-dialog position="right" v-model="show" seamless persistent square>
    <q-card style="max-width: 75vh; min-height: 20vh; min-width: 50vh">
      <q-toolbar class="bg-accent text-white">
        <q-item-label class="text-h6 absolute-center"
          >Create a Product</q-item-label
        >
        <q-space />
        <q-btn dense flat icon="close" @click="$router.push('/products')" />
      </q-toolbar>
      <q-card-section class="text-subtitle1" style="width: 100%">
        <div
          v-if="selectableComponents.length === 0 && !loadingComponents"
          class="q-mr-md"
        >
          No components available 😢
        </div>
        <div v-else class="q-mr-md">Select components:</div>
      </q-card-section>
      <q-card-section class="q-gutter-md row scroll" style="max-height: 50vh">
        <GeneralCard
          v-for="selectable in selectableComponents"
          :key="selectable.component.id"
          :name="selectable.component.productName"
          :image-url="selectable.component.imageUrl"
          :price="selectable.component.uvp"
          v-bind:style="
            selectable.selected
              ? {
                  background: 'rgba(0, 85, 153, 0.2)',
                  outline: '2px solid rgba(0, 85, 153, 0.8)',
                }
              : {}
          "
          @click="select(selectable)"
        >
        </GeneralCard>
        <div v-if="loadingComponents" class="text-subtitle1">
          <q-spinner-ball color="primary" size="2em" />
        </div>
      </q-card-section>
      <q-separator></q-separator>
      <!--<q-card-section>
        <div class="q-mr-md text-subtitle1">Add a name:</div>
        <q-input v-model="input" label="Type something..." />
      </q-card-section>
       -->
      <q-card-actions class="q-ma-sm" align="right">
        <q-btn
          :disable="selectedComponents.length === 0"
          :loading="loadingCreate"
          icon-right="add"
          color="positive"
          label="Create Product"
          @click="createProduct()"
        ></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import GeneralCard from './GeneralCard.vue';
import { useCurrencyStore } from 'src/stores/currency';
import { Notify } from 'quasar';
import { useProductStore } from 'src/stores/product';
import { Component, useComponentStore } from 'src/stores/component';

const selectableComponentList = ref<SelectableComponent[]>([]);
const isLoading = ref<boolean>(true);

interface SelectableComponent {
  component: Component;
  selected: boolean;
}

async function loadComponents(currency: string) {
  try {
    const receivedComponents = await useComponentStore().getAll(currency);
    selectableComponentList.value = receivedComponents.map((component) => ({
      component: component,
      selected: false,
    }));
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Components could not be fetched',
    });
  }
  isLoading.value = false;
}

export default defineComponent({
  name: 'CreateProductDialog',
  computed: {
    selectedComponents() {
      return selectableComponentList.value
        .map((selectable) =>
          selectable.selected ? selectable.component : undefined
        )
        .filter((component) => component as Component) as Component[];
    },
  },
  methods: {
    async createProduct() {
      const productStore = useProductStore();
      this.loadingCreate = true;
      if (this.selectedComponents.length >= 0) {
        try {
          await productStore.create(this.selectedComponents);
          Notify.create({
            type: 'positive',
            message: 'New Product created',
          });
          this.$router.push('/products');
        } catch (error) {
          Notify.create({
            type: 'negative',
            message: 'Product could not be created',
          });
        }
      }
      this.loadingCreate = false;
    },

    async select(selectable: SelectableComponent) {
      if (selectable.selected) {
        selectable.selected = false;
      } else {
        selectable.selected = true;
      }
    },
  },
  async setup() {
    const currencyStore = useCurrencyStore();

    loadComponents(currencyStore.currency);

    currencyStore.$subscribe((_mutation, state) => {
      loadComponents(state.currency);
    });

    return {
      show: ref(true),
      currency: currencyStore.currency,
      loadingCreate: ref(false),
      loadingComponents: isLoading,
      //input: ref(''),
      selectableComponents: selectableComponentList,
    };
  },
  components: { GeneralCard },
});
</script>
