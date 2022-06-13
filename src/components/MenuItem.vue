<template>
  <q-item
    class="menu-item"
    clickable
    active-class="menu-item-active"
    :to="path"
  >
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MenuItem',
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: '',
    },
    path: {
      type: String,
      default: '',
    },
  },
});
</script>

<style lang="scss">
.menu-item {
  border-radius: 14px;
  margin-top: 2%;
}
.menu-item-active {
  color: $secondary;
  background-color: $primary;
}
</style>
