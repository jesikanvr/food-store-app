<template>
  <q-page class="body">
    <div class="container content-center">
      <product-card-vue
        class="box"
        v-for="d in products"
        :key="d"
        :product="d"
        :selected="isSelected(d.id)"
        :amount="numberProduct(d.id)"
        @add="selectProduct"
        @select="ratingProduct"
        @increment="increment"
      />
    </div>
    <div class="index flex flex-center q-mb-md">
      <q-card
        v-if="
          favoriteDishes.length == 0 ||
          (isSearching && searchedDishes.length == 0)
        "
        flat
        bordered
        class="q-ma-md bg-grey-2"
      >
        <q-card-section>{{
          !isSearching
            ? `Debe valorar alguno de nuestros productos
               con un perfecto cinco para que aparezcan
               productos en esta sección. Gracias`
            : `No hay coincidencias`
        }}</q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";

import ProductCardVue from "src/components/cards/ProductCard.vue";

import { useProductsStore } from "stores/products";

import { storeToRefs } from "pinia";
import { useOrdersStore } from "src/stores/orders";

export default defineComponent({
  name: "IndexPage",
  components: {
    ProductCardVue,
  },
  created() {
    try {
      this.product.getFavoritesProducts();
    } catch (error) {
      console.log(error);
    }
  },
  setup() {
    const product = useProductsStore();
    const orders = useOrdersStore();
    const { favoriteDishes, searchedDishes, isSearching } =
      storeToRefs(product);
    const { getOnSaleProducts, doRating, downloadImages } = product;
    const { isSelected, numberProduct } = storeToRefs(orders);
    const { addProduct, deleteProduct, increment, decrement } = orders;
    return {
      product,
      downloadImages,
      favoriteDishes,
      getOnSaleProducts,
      isSelected,
      numberProduct,
      searchedDishes,
      isSearching,
      selectProduct(id, action) {
        action ? addProduct(id) : deleteProduct(id);
      },
      ratingProduct(id, stars) {
        doRating(id, stars);
      },
      increment(id, action) {
        action ? increment(id) : decrement(id);
      },
    };
  },
  computed: {
    products() {
      if (this.isSearching) {
        return this.searchedDishes;
      }
      return this.favoriteDishes;
    },
  },
});
</script>
<style lang="scss">
.body {
  margin: 0;
  padding: 0;
}
.container {
  width: 1200px;
  margin: 20px auto;
  columns: 4;
  column-gap: 20px;
}
.container .box {
  width: 100%;
  margin: 0 0 20px;
  overflow: hidden;
  break-inside: avoid;
}
.container .box img {
  max-width: 100%;
}
@media (max-width: 1200px) {
  .container {
    columns: 3;
    width: calc(100% - 40px);
    box-sizing: border-box;
    padding: 20px 20px 20px 0;
  }
}
@media (max-width: 480px) {
  .container {
    columns: 2;
  }
}
@media (max-width: 768px) {
  .container {
    columns: 1;
  }
}
.pagination {
  margin: 0 auto;
}
.pagination-btn {
  position: relative;
  bottom: -45px;
}
</style>
