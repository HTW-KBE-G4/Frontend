<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated>
      <q-toolbar class="shadow-2 rounded-borders text-center">
        <q-toolbar-title>
          <q-avatar size="65px" class="q-ma-xs q-mr-md">
            <img src="/favicon.ico" />
          </q-avatar>
          Tanuki Hardware Store
          <div class="absolute-right">
            <q-btn
              class="bg-white text-dark q-mr-sm"
              round
              dense
              :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
              @click="toggleDarkMode"
            />
            <q-btn-dropdown
              class="bg-white text-black q-ma-md"
              text-primary
              v-bind:label="selectedCurrency.name"
            >
              <q-list>
                <q-item
                  v-for="currency in currencies"
                  :key="currency.name"
                  v-bind="currency"
                  clickable
                  v-close-popup
                  @click="selectCurrency(currency)"
                >
                  <q-item-section>{{ currency.name }}</q-item-section>
                  <q-item-section side>{{ currency.symbol }}</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      bordered
      class="q-pa-md"
      show-if-above
      :width="220"
      :breakpoint="500"
    >
      <q-list>
        <MenuItem
          v-for="item in menuItems"
          :key="item.path"
          v-bind="item"
          @click="onMenuItemClick(item.path)"
        />
      </q-list>
      <q-separator />
      <q-btn
        class="absolute-bottom-left q-ma-md"
        icon="logout"
        rounded
        color="negative"
        label="Logout"
        @click="logout"
      />
    </q-drawer>

    <q-footer
      bordered
      class="absolute-bottom-left"
      v-bind:style="
        $q.dark.isActive ? { background: '#1d1d1d' } : { background: 'white' }
      "
    >
      <q-tabs
        no-caps
        active-color="primary"
        indicator-color="transparent"
        class="text-grey"
      >
        <a class="q-ma-sm q-pt-sm q-pr-md" href="https://github.com/HTW-KBE-G4"
          ><img src="/GitHub-Mark-32px.png"
        /></a>
        <a
          class="text-grey"
          href="https://www.flaticon.com/free-icons/raccoon"
          title="raccoon icons"
          >Raccoon icons created by Freepik - Flaticon</a
        >
      </q-tabs>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
  <router-view name="dialog" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
//import { useRouter } from 'vue-router';
import MenuItem from 'components/MenuItem.vue';

const menuItemList = [
  {
    title: 'Products',
    icon: 'shopping_cart',
    path: 'products',
  },
  {
    title: 'Components',
    icon: 'memory',
    path: 'components',
  },
  {
    title: 'About',
    icon: 'groups',
    path: 'about',
  },
];

// Mock list
const currencyList = [
  {
    name: 'EUR',
    symbol: '€',
  },
  {
    name: 'USD',
    symbol: '$',
  },
  {
    name: 'YEN',
    symbol: '¥',
  },
];

export default defineComponent({
  name: 'MainLayout',

  components: { MenuItem },

  methods: {
    onMenuItemClick(path: string) {
      this.$router.push(path);
      console.log('Switched to path: ' + path);
    },

    selectCurrency(currency: { name: string; symbol: string }) {
      this.selectedCurrency = currency;
      console.log('Currency set to ' + currency.name);
    },

    logout() {
      //void router.push(/); ?
      //keycloak.logout;
      console.log('Logged out');
    },

    toggleDarkMode() {
      // $q.dark.isActive();
      this.$q.dark.toggle();
    },
  },

  setup() {
    //TODO: fill currencyList by getting String Array (?) of available currencies from backend

    //TODO: Wait for product page to load and then do something like .. mabye
    //const router = useRouter();
    //router.push('/products');

    return {
      menuItems: menuItemList,
      currencies: currencyList,
      selectedCurrency: ref({
        name: 'EUR',
        symbol: '€',
      }),
    };
  },
});
</script>
