<template>
  <q-page padding v-if="exitOrder(id)">
    <!-- content -->
    <q-card id="document" class="doc q-pb-xl">
      <q-card-section class="header">
        <div class="row">
          <q-img
            src="../assets/icons/chef_hat.png"
            width="100px"
            height="110px"
          />
          <div class="text-header row q-mt-lg">
            <div class="text-weight-medium">
              Empresa Gustó,
              {{ order.recepcionist.municipalities.name }}
              <p class="text-weight-light">La Habana, Cuba</p>
            </div>
            <div class="text-weight-light q-ml-xl">
              <p>Web: www.gustofoodstore.com</p>
              <p>E-mail: gustoinfo@gmail.com</p>
              <p>Tel: +53 584-34-33-45</p>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-separator class="q-mx-lg" />
      <q-card-section class="content q-px-xl">
        <div class="content-title row items-center justify-between">
          <div class="text-h5">Pedido</div>
          <div class="text-weight-light">Fecha: {{ order.date }}</div>
        </div>
        <div>
          <div>
            <p class="text-subtitle2">Factura a</p>
            <ul>
              <li>{{ order.client.name }} {{ order.client.last_name }}</li>
              <li>{{ order.address.formatted }}</li>
              <li>{{ order.client.phone }}</li>
            </ul>
          </div>
        </div>
        <div class="content-table q-mt-md">
          <q-table
            id="table"
            :rows="factureRows"
            :columns="columns"
            row-key="name"
            flat
            dense
            hide-bottom
          />
        </div>
      </q-card-section>
      <q-card-section class="q-px-xl">
        <div align="right">Total: {{ order.totalPrice }}</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { storeToRefs } from "pinia";
import { useOrdersStore } from "src/stores/orders";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
  // name: 'PageName',
  props: {
    id: { type: Number, required: true },
  },
  beforeCreate() {
    if (this.exitOrder(this.id)) {
      this.order = this.getOrderById(this.id);
      console.log(this.order);
      this.$bus.on("print", () => {
        this.imprimir();
      });
    } else {
      console.log("Aquiiiiiiiiiiiiiiii", this.exitOrder(this.id));
      const router = useRouter();
      router.push({ name: "notFound" });
    }
  },
  setup(props) {
    const orders = useOrdersStore();
    const { getOrderById, productsOrders, factureRows, exitOrder } =
      storeToRefs(orders);
    const order = ref(null);
    onMounted(() => {
      if (exitOrder.value(props.id)) {
        orders.prepareFactureOrder(order.value.id);
        console.log(factureRows.value);
        const table = document.getElementById("table");
      }
    });
    const columns = [
      {
        name: "product",
        field: "product",
        label: "Producto",
        align: "left",
      },
      {
        name: "amount",
        field: "amount",
        label: "Cant.",
        align: "left",
      },
      {
        name: "price",
        field: "price",
        label: "Precio",
        align: "left",
      },
      {
        name: "total",
        field: "total",
        label: "Total",
        align: "left",
      },
    ];
    function imprimir() {
      const elemento = document.getElementById("document");
      console.log(elemento);
      var ventana = window.open("", "PRINT", "height=400,width=600");
      ventana.document.write(
        "<html><head><title>" + document.title + "</title>"
      );
      ventana.document.write('<link rel="stylesheet" href="imprimir.css">'); //Cargamos otra hoja, no la normal
      ventana.document.write("</head><body >");
      ventana.document.write(elemento.innerHTML);
      ventana.document.write("</body></html>");
      ventana.document.close();
      ventana.focus();
      ventana.onload = function () {
        ventana.print();
        ventana.close();
      };
      return true;
    }
    return {
      getOrderById,
      order,
      exitOrder,
      columns,
      factureRows,
      imprimir,
    };
  },
};
</script>
<style lang="scss">
.doc {
  margin: 0 auto;
  width: 595px;
}

.text-header p {
  margin: 0px 0px 3px 0px;
}
ul {
  list-style-type: none;
  padding: 0px;
}
.content p {
  margin: 20px 0px 0px 0px;
}
.content ul {
  margin: 0px;
}
</style>
