<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated>
      <q-toolbar class="shadow-2 rounded-borders">
        <q-toolbar-title class="text-center"
          ><q-avatar size="65px" class="q-ma-xs q-mr-md">
            <img src="/favicon.ico" />
          </q-avatar>
          Tanuki Hardware Shop
        </q-toolbar-title>

        <q-btn
          class="bg-white text-dark q-mr-sm"
          round
          dense
          :icon="$q.dark.isActive ? 'sunny' : 'nights_stay'"
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
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
  <router-view name="dialog" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev',
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework',
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev',
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev',
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev',
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev',
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev',
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

  components: {},

  methods: {
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
    const leftDrawerOpen = ref(false);

    return {
      currencies: currencyList,
      selectedCurrency: ref({
        name: 'EUR',
        symbol: '€',
      }),
    };
  },
});
</script>
