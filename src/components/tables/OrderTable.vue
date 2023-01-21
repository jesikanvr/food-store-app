<template>
  <div class="q-pa-md">
    <q-table
      title="Su pedido"
      :rows="orderTable"
      :columns="columns"
      row-key="name"
      binary-state-sort
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="amount" :props="props">
            {{ props.row.amount }}
            <q-popup-edit
              v-model.number="props.row.amount"
              buttons
              label-set="Guardar"
              label-cancel="Cerrar"
              :validate="amountRangeValidation"
              @hide="amountRangeValidation"
              @save="
                (value, initialValue) =>
                  updateAmount(props.row.id, value, initialValue)
              "
              v-slot="scope"
            >
              <q-input
                type="number"
                v-model.number="scope.value"
                hint="Introduzca un número entre 1 y 20"
                :error="errorAmount"
                :error-message="errorMessageAmount"
                dense
                autofocus
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="price" :props="props">
            <div class="text-pre-wrap">{{ props.row.price }}</div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";

import { useOrdersStore } from "src/stores/orders";
import { storeToRefs } from "pinia";

export default defineComponent({
  beforeCreate() {
    this.generateOrder();
  },
  data() {
    return {
      columns: [
        {
          name: "name",
          required: true,
          label: "Producto",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "amount",
          align: "center",
          label: "Cantidad",
          field: "amount",
          sortable: true,
        },
        {
          name: "price",
          label: "Precio",
          field: "price",
          sortable: true,
          style: "width: 10px",
        },
      ],
    };
  },
  setup() {
    const order = useOrdersStore();
    const { generateOrder } = order;
    const { orderTable } = storeToRefs(order);

    const errorAmount = ref(false);
    const errorMessageAmount = ref("");

    return {
      orderTable,
      generateOrder,
      updateAmount(productId, value, initialValue) {
        order.updateAmount(productId, value, initialValue);
      },
      errorAmount,
      errorMessageAmount,
    };
  },
  methods: {
    amountRangeValidation(val) {
      if (val < 1 || val > 20) {
        this.errorAmount = true;
        this.errorMessageAmount = "¡El valor debe estar entre 1 y 20!";
        return false;
      }
      this.errorAmount = false;
      this.errorMessageAmount = "";
      return true;
    },
  },
});
</script>
