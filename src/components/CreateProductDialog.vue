<template>
  <q-dialog data-cy="create-popup" v-model="show" persistent>
    <q-card style="max-width: 75vh; min-height: 20vh; min-width: 50vh">
      <q-toolbar class="bg-accent text-white">
        <q-item-label class="text-h6 absolute-center"
          >Create a Product</q-item-label
        >
        <q-space />
        <q-btn rounded flat icon="close" @click="$router.push('/products')" />
      </q-toolbar>
      <q-card-section
        class="q-mt-md"
        style="width: 100%; font-weight: normal; font-size: large"
      >
        <div v-if="selectableComponents.length === 0 && !loadingComponents">
          No hardware components available 😢
        </div>
        <div class="q-mb-md" v-else>Select hardware components:</div>
      </q-card-section>
      <q-card-section
        data-cy="selectable-components"
        class="q-gutter-md row scroll"
        style="max-height: 50vh"
      >
        <GeneralCard
          v-for="selectable in selectableComponents"
          :key="selectable.component.component_id"
          :name="selectable.component.productName"
          :image-u-r-l="selectable.component.imageURL"
          :price="selectable.component.uvp"
          v-bind:style="selectable.selected ? styleSelected : styleUnselcted"
          @click="select(selectable)"
        >
        </GeneralCard>
        <div v-if="loadingComponents" class="text-subtitle1">
          <q-spinner-ball color="primary" size="2em" />
        </div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section>
        <q-input
          data-cy="name-input"
          color="primary"
          stack-label
          outlined
          v-model="nameInput"
          label="Add a name..."
        />
      </q-card-section>
      <q-card-actions class="q-ma-sm" align="right">
        <q-btn
          data-cy="create-button"
          :disable="selectedComponents.length <= 0 || nameInput.length <= 0"
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
import { defineComponent, ref, watch } from 'vue';
import GeneralCard from './GeneralCard.vue';
import { useCurrencyStore } from 'src/stores/currency';
import { useProductStore } from 'src/stores/product';
import {
  HardwareComponent,
  useComponentStore,
} from 'src/stores/hardwareComponent';
import { displayNotification } from 'src/utils';

const selectableComponentList = ref<SelectableComponent[]>([]);
const isLoading = ref<boolean>(true);

interface SelectableComponent {
  component: HardwareComponent;
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
    displayNotification('Hardware components could not be fetched', true);
  }
  isLoading.value = false;
}

export default defineComponent({
  name: 'CreateProductDialog',
  components: { GeneralCard },
  computed: {
    selectedComponents() {
      return selectableComponentList.value
        .map((selectable) =>
          selectable.selected ? selectable.component : undefined
        )
        .filter(
          (component) => component as HardwareComponent
        ) as HardwareComponent[];
    },
  },
  methods: {
    async createProduct() {
      const productStore = useProductStore();
      this.loadingCreate = true;
      const components = this.selectedComponents;
      const name = this.nameInput;
      if (components.length > 0 && name.length > 0 && name.length <= 50) {
        try {
          await productStore.create(name, components);
          displayNotification('New Product created', false);
          this.$router.push('/products');
        } catch (error) {
          displayNotification('Product could not be created', true);
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

    watch(
      () => currencyStore.$state.currency,
      (newCurrency) => {
        loadComponents(newCurrency);
      }
    );

    return {
      show: ref(true),
      loadingCreate: ref(false),
      loadingComponents: isLoading,
      nameInput: ref(''),
      selectableComponents: selectableComponentList,
      styleSelected: {
        background: 'rgba(100, 149, 255, 0.2)',
        outline: '3px solid rgba(100, 149, 255, 0.8)',
      },
      styleUnselcted: {},
    };
  },
});
</script>
