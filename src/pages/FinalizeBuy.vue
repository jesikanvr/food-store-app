<template>
  <q-page padding>
    <section class="fit row wrap justify-start items-start content-start">
      <section class="col-grow" align="right">
        <div class="q-mx-md">Total: {{ totalPrice }}</div>
        <order-table-vue />
      </section>
      <section class="col-grow">
        <send-order-vue @add="addAddress" />
      </section>
    </section>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

import OrderTableVue from "src/components/tables/OrderTable.vue";
import SendOrderVue from "src/components/forms/SendOrder.vue";
import { useRouter } from "vue-router";
import { useOrdersStore } from "src/stores/orders";
import { storeToRefs } from "pinia";

export default defineComponent({
  components: {
    OrderTableVue,
    SendOrderVue,
  },
  setup() {
    const router = useRouter();
    const order = useOrdersStore();
    const { totalPrice } = storeToRefs(order);
    return {
      totalPrice,
      addAddress() {
        router.push({ name: "addAddress" });
      },
    };
  },
});
</script>
