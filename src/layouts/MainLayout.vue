<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated>
      <q-toolbar class="shadow-2 rounded-borders">
        <q-btn
          style="margin-right: 8em"
          flat
          @click="drawer = !drawer"
          round
          dense
          icon="menu"
        />
        <q-toolbar-title class="text-center">
          <q-avatar size="65px" class="q-mr-md">
            <img src="/favicon.ico" />
          </q-avatar>
          Tanuki Hardware Store
        </q-toolbar-title>
        <q-btn
          class="bg-primary text-white q-mr-md"
          flat
          round
          dense
          :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
          @click="toggleDarkMode"
        />
        <q-btn-dropdown
          class="text-white q-ma-sm"
          flat
          style="
            width: 5em;
            outline: 8px ridge rgba(170, 50, 220, 0.6);
            border-radius: 1rem;
          "
          v-bind:label="getCurrencySymbol(currency)"
        >
          <q-list>
            <q-item
              v-for="currency in currencies"
              :key="currency.at"
              clickable
              v-close-popup
              @click="selectCurrency(currency)"
              ><q-item-label class="absolute-center">{{
                getCurrencySymbol(currency)
              }}</q-item-label>
              <q-separator />
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
      <q-btn
        class="q-ma-md absolute-bottom-left"
        icon="logout"
        rounded
        color="negative"
        label="Logout"
        @click="logout()"
      />
    </q-drawer>
    <q-footer
      bordered
      v-bind:style="
        $q.dark.isActive ? { background: '#1d1d1d' } : { background: 'white' }
      "
    >
      <q-tabs no-caps>
        <a
          class="q-ma-sm q-pr-md"
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/HTW-KBE-G4"
        >
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
          target="_blank"
          class="text-grey-9 text-subtitle2"
          rel="noopener noreferrer"
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

    getCurrencySymbol(currency: string): string {
      return currencyStore.getCurrencySymbol(currency);
    },

    logout() {
      const logoutOptions = { redirectUri: window.location.origin };
      this.$keycloak.keycloak?.logout(logoutOptions);
    },

    toggleDarkMode() {
      this.$q.dark.toggle();
      localStorage.setItem('darkMode', this.$q.dark.isActive.toString());
    },
  },

  async setup() {
    const $q = useQuasar();
    currencyList.value = currencyStore.currencies;

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
::-webkit-scrollbar-track {
  border-radius: 0.125rem;
  background-color: lightgray;
}
::-webkit-scrollbar {
  width: 0.25rem;
  border-radius: 0.125rem;
}
::-webkit-scrollbar-thumb {
  border-radius: 0.125rem;
  background-color: gray;
}

.q-dialog__backdrop {
  backdrop-filter: blur(3px);
}
</style>
