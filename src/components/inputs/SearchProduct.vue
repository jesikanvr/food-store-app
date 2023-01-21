<template>
  <div>
    <q-input
      class="search"
      dense
      rounded
      outlined
      type="search"
      v-model="search"
      placeholder="Buscar"
      clearable
      @keyup.enter="searchProducts"
    >
      <template v-slot:after>
        <q-btn round dense flat icon="search" @click="searchProducts()" />
      </template>
    </q-input>
  </div>
</template>
<script>
import { defineComponent, ref } from "vue";

import { useProductsStore } from "src/stores/products";

export default defineComponent({
  setup() {
    const products = useProductsStore();
    const { searchDishes, restartSearch } = products;
    return {
      search: ref(null),
      searchDishes,
      restartSearch,
    };
  },
  methods: {
    searchProducts() {
      if (this.search > "") {
        this.searchDishes(this.search);
      }
    },
  },
  watch: {
    search(newVal, oldVal) {
      if (newVal <= "") {
        this.restartSearch();
      }
    },
  },
});
</script>
