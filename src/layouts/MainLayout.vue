<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated>
      <q-toolbar class="shadow-2 rounded-borders">
        <q-btn flat @click="drawer = !drawer" round dense icon="menu" />

        <q-toolbar-title class="text-center">
          <q-avatar size="65px" class="q-ma-xs q-mr-md">
            <img src="/favicon.ico" />
          </q-avatar>
          Tanuki Hardware Store
        </q-toolbar-title>

        <q-btn
          class="bg-white text-dark q-mr-md"
          round
          dense
          :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
          @click="toggleDarkMode"
        />

        <q-btn-dropdown
          class="bg-white text-black q-ma-sm"
          text-primary
          v-bind:label="currency"
        >
          <q-list>
            <q-item
              v-for="currency in currencies"
              :key="currency.at"
              clickable
              v-close-popup
              @click="selectCurrency(currency)"
            >
              <q-item-section>{{ currency }}</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      class="q-pa-md"
      elevated
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
        class="q-ma-md absolute-bottom-left"
        icon="logout"
        rounded
        color="negative"
        label="Logout"
        @click="logout"
      />
    </q-drawer>

    <q-footer
      bordered
      v-bind:style="
        $q.dark.isActive ? { background: '#1d1d1d' } : { background: 'white' }
      "
    >
      <q-tabs no-caps>
        <a class="q-ma-sm q-pr-md" href="https://github.com/HTW-KBE-G4">
          <q-avatar
            size="32px"
            v-bind:style="
              $q.dark.isActive
                ? { filter: 'invert(100%)' }
                : { filter: 'brightness(100%)' }
            "
          >
            <img src="/GitHub-Mark-32px.png" bg-white />
          </q-avatar>
        </a>
        <a
          class="text-grey text-subtitle2"
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
import { useQuasar } from 'quasar';
import MenuItem from 'components/MenuItem.vue';
import { useCurrencyStore } from 'stores/currency';

const menuItemList = [
  {
    title: 'Products',
    icon: 'shopping_cart',
    path: '/products',
  },
  {
    title: 'Components',
    icon: 'memory',
    path: '/components',
  },
  {
    title: 'About',
    icon: 'groups',
    path: '/about',
  },
];

const currencyStore = useCurrencyStore();
const currencyList = ref<string[]>([]);

export default defineComponent({
  name: 'MainLayout',

  components: { MenuItem },

  methods: {
    onMenuItemClick(path: string) {
      this.$router.push(path);
    },

    selectCurrency(currency: string) {
      currencyStore.change(currency);
      this.currency = currencyStore.currency;
      localStorage.setItem('currency', this.currency);
    },

    logout() {
      //keycloak.logout;
      console.log('Logged out');
    },

    toggleDarkMode() {
      this.$q.dark.toggle();
      localStorage.setItem('darkMode', this.$q.dark.isActive.toString());
    },
  },

  async setup() {
    const $q = useQuasar();

    currencyList.value = await currencyStore.getAll();

    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      $q.dark.set(savedMode === 'true' ? true : false);
    }

    const savedCurrency = localStorage.getItem('currency');
    if (savedCurrency) {
      currencyStore.change(savedCurrency);
    }
    let currency = ref(currencyStore.currency);

    return {
      drawer: ref(false),
      menuItems: menuItemList,
      currencies: currencyList,
      currency,
    };
  },
});
</script>

<style lang="scss">
::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-thumb {
  background: $selected;
  width: 1px;
}

::-webkit-scrollbar-thumb:hover {
  background: $primary;
}
</style>
