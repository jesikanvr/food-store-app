<template>
  <q-page padding>
    <!-- content -->
    <table-vue-vue
      :pcolumns="columns"
      :prows="rows"
      :buttonsRows="buttonsRows"
      :buttonsHeader="buttonsHeader"
      ptitle="Productos"
      :loading="loading"
      :onRequest="onRequest"
      :pagination="pagination"
    />
  </q-page>
</template>

<script>
import { useProductsStore } from "src/stores/products";

import TableVueVue from "src/components/tables/TableVue.vue";

import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useQuasar } from "quasar";

export default {
  // name: 'PageName',
  components: {
    TableVueVue,
  },
  beforeCreate() {
    this.getAllProducts();
  },
  setup() {
    const router = useRouter();
    const product = useProductsStore();
    const { getAllProducts } = product;
    const { products, meta } = storeToRefs(product);
    const $q = useQuasar();

    const columns = [
      {
        name: "name",
        required: true,
        label: "Nombre",
        align: "left",
        field: (row) => row.name,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "price",
        align: "center",
        label: "Precio",
        field: "price",
        sortable: true,
      },
      {
        name: "onSale",
        label: "¿En venta?",
        field: (row) => (row.onSale ? "Sí" : "No"),
      },
      {
        name: "rating",
        label: "Calificación",
        field: (row) => Math.round(row.rating),
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
        label: "Ver detalles",
        icon: "details",
        align: "between",
        action: editAddProduct,
      },
      {
        label: "Eliminar",
        icon: "delete",
        align: "between",
        color: "secondary",
        action: deleteProduct,
      },
    ];
    const buttonsHeader = [
      {
        label: "Añadir producto",
        icon: "add",
        align: "between",
        action: editAddProduct,
      },
    ];
    /**
     * Esto es para la paginación
     */
    const rows = ref([]);
    const filter = ref("");
    const loading = ref(false);
    const pagination = ref({
      sortBy: "id",
      descending: false,
      page: 0,
      rowsPerPage: 5,
      rowsNumber: 10,
    });
    async function onRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      const filter = props.filter;

      // console.log(page, rowsPerPage, sortBy, descending);

      loading.value = true;

      // get all rows if "All" (0) is selected
      const fetchCount =
        rowsPerPage === 0 ? pagination.value.rowsNumber : rowsPerPage;

      // calculate starting row of data
      const startRow = page - 1; //* rowsPerPage;

      // fetch data from "server"
      await getAllProducts(
        startRow,
        fetchCount,
        sortBy,
        descending,
        filter,
        0
      ).then(() => {
        loading.value = false;
      });

      const returnedData = products.value;

      // update rowsCount with appropriate value
      pagination.value.rowsNumber = meta.value.totalProducts;

      // console.log(pagination.value.rowsNumber);

      // clear out existing data and add new
      rows.value.splice(0, rows.value.length, ...returnedData);

      // don't forget to update local pagination object
      pagination.value.page = page;
      pagination.value.rowsPerPage = rowsPerPage;
      pagination.value.sortBy = sortBy;
      pagination.value.descending = descending;

      // ...and turn of loading indicator
      // emulate server
      // setTimeout(() => {}, 1500);
    }
    function editAddProduct(id) {
      if (typeof id == "number") {
        router.push({ name: "editProduct", params: { id: id } });
        console.log("Aquiiiiiiiiiiiiiiiii");
      } else {
        router.push({ name: "addProduct" });
      }
    }
    function deleteProduct(id) {
      if (id != undefined) {
        $q.dialog({
          title: "Confirmar",
          message: `¿Desea eliminar el producto?`,
          cancel: "Cancelar",
          ok: "Aceptar",
          persistent: true,
        }).onOk(() => {
          product.delete(id, rows);
          console.log(rows);
        });
      }
    }
    return {
      getAllProducts,
      editAddProduct,
      deleteProduct,
      columns,
      rows,
      buttonsRows,
      buttonsHeader,
      products,
      loading,
      onRequest,
      pagination,
    };
  },
};
</script>
