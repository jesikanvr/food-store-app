<template>
  <div class="q-pa-md q-gutter-md">
    <q-btn round color="secondary" icon="notifications">
      <q-badge color="red" floating transparent>
        {{ notificationCount }}
      </q-badge>
      <q-tooltip :delay="1000"> Notificaciones </q-tooltip>
      <q-menu fit :offset="[200, 5]">
        <q-list style="min-width: 100px">
          <q-item v-for="order in invalidOrders" :key="order">
            <q-item-section>
              <div class="row justify-center items-center q-gutter-sm">
                <p class="text-caption q-ma-none q-mt-sm">
                  #{{ order.id }} - {{ order.client.user }}
                </p>
                <q-btn
                  round
                  size="10px"
                  outline
                  icon="location_on"
                  @click="validate(order.address.id)"
                >
                  <q-tooltip :delay="2000"> Validar pedido </q-tooltip>
                </q-btn>
                <q-btn
                  round
                  size="10px"
                  outline
                  icon="done"
                  color="positive"
                  @click="agree(order.address.id)"
                >
                  <q-tooltip :delay="2000"> Aceptar pedido </q-tooltip>
                </q-btn>
                <q-btn
                  round
                  size="10px"
                  outline
                  icon="clear"
                  color="negative"
                  @click="decline(order.id)"
                >
                  <q-tooltip :delay="2000"> Rechazar pedido </q-tooltip>
                </q-btn>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>
<script>
import { storeToRefs } from "pinia";
import { useMapsStore } from "src/stores/maps";
import { useNotifyStore } from "src/stores/notifications";
import { useOrdersStore } from "src/stores/orders";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const router = useRouter();
    const notifications = useNotifyStore();
    const { notificationCount } = storeToRefs(notifications);
    const orders = useOrdersStore();
    const { invalidOrders } = storeToRefs(orders);
    const maps = useMapsStore();
    return {
      notificationCount,
      invalidOrders: invalidOrders.value.reverse(),
      validate(id) {
        router.push({ name: "validAddresses", params: { id: id } });
      },
      agree(id) {
        maps.setIsvalid(id);
        router.push({ name: "printOrders", params: { id: id } });
      },
      decline(id) {
        orders.updateState(id, 2);
      },
    };
  },
});
</script>
