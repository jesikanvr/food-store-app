<template>
  <q-page padding>
    <!-- content -->
    <q-card class="row" flat bordered>
      <iframe
        class="q-pa-sm"
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d62209.94200043367!2d-82.35940855057916!3d23.10083438439786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2scu!4v1673155179376!5m2!1ses!2scu"
        width="100%"
        height="500"
        style="border: 0"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
      <div v-if="address != null" class="absolute-top-right q-ma-xl">
        <q-card bordered flat>
          <q-card-section>
            <p class="text-overline">Dirección</p>
            <p>{{ address.formatted }}</p>
            <p class="text-overline">Municipio</p>
            <p>{{ address.municipalities.name }}</p>
          </q-card-section>
        </q-card>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { useOrdersStore } from "src/stores/orders";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
export default {
  // name: 'PageName',
  props: {
    id: { type: Number, required: false },
  },
  beforeCreate() {
    this.address = this.getOrderAddressById(this.id);
  },
  setup(props) {
    const orders = useOrdersStore();
    const { getOrderAddressById, ordersAddress } = storeToRefs(orders);
    return {
      getOrderAddressById,
      address: ref(null),
      ordersAddress,
    };
  },
};
</script>
