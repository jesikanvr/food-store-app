<template>
  <q-page padding>
    <!-- content -->
    <div>
      <table-vue-vue
        :pcolumns="columns"
        :prows="rows"
        :buttonsRows="buttonsRows"
        ptitle="Pedidos"
        :loading="loading"
        :onRequest="onRequest"
        :pagination="pagination"
      />
    </div>
  </q-page>
</template>

<script>
import { onMounted, ref } from "vue";

import TableVueVue from "src/components/tables/TableVue.vue";
import { useOrdersStore } from "src/stores/orders";
import { storeToRefs } from "pinia";
import { useNotifyStore } from "src/stores/notifications";
import { useRouter } from "vue-router";
export default {
  // name: 'PageName',
  components: {
    TableVueVue,
  },
  setup() {
    const routers = useRouter();
    const rout = useRouter();
    const order = useOrdersStore();
    const notifications = useNotifyStore();
    const { onRequest } = order;
    const { rows, filter, loading, pagination } = storeToRefs(order);
    const { router } = storeToRefs(notifications);
    onMounted(() => {
      router.value = rout;
    });
    const columns = [
      {
        name: "id",
        required: true,
        label: "#",
        align: "left",
        field: "id",
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "client",
        align: "center",
        label: "Cliente",
        field: "client",
        format: (val) => `${val.name} ${val.last_name}`,
        sortable: true,
      },
      {
        name: "state",
        label: "Estado",
        field: "state",
      },
      {
        name: "sale_date",
        label: "Fecha de venta",
        field: "date",
      },
      {
        name: "address",
        label: "Dirección de entrega",
        field: "address",
        format: (val) => `${val.formatted}`,
        align: "right",
      },
      {
        name: "actions",
        label: "Acciones",
        field: "actions",
        align: "right",
      },
    ];
    const buttonsRows = [
      {
        label: "Ver",
        icon: "visibility",
        align: "between",
        action: showOrder,
      },
    ];
    function showOrder(id) {
      if (id != undefined) {
        routers.push({ name: "printOrders", params: { id: id } });
      }
    }
    return {
      columns,
      rows,
      buttonsRows,
      loading,
      onRequest,
      pagination,
    };
  },
};
</script>
