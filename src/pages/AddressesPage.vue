<template>
  <q-page padding>
    <!-- content -->
    <div class="q-mx-md">
      <table-vue-vue
        :pcolumns="columns"
        :prows="addresses"
        ptitle="Sus direcciones"
        :ptype="{ pronoun: `la`, name: `dirección` }"
        @select="editAddAddress"
        @click="deleteAddress"
        :buttonsHeader="buttonsHeader"
        :buttonsRows="buttonsRows"
      />
    </div>
  </q-page>
</template>

<script>
import TableVueVue from "src/components/tables/TableVue.vue";

import { useMapsStore } from "src/stores/maps";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

export default {
  // name: 'PageName',
  components: {
    TableVueVue,
  },
  setup() {
    const router = useRouter();
    const maps = useMapsStore();
    const { addresses } = storeToRefs(maps);
    const $q = useQuasar();
    const columns = [
      {
        name: "alias",
        field: "alias",
        required: true,
        label: "Alias",
        align: "left",
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "formatted",
        align: "left",
        label: "Dirección",
        field: "formatted",
      },
      {
        name: "apto",
        label: "Apartamento",
        field: "apto",
        style: "width: 150px",
        align: "left",
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
        label: "Editar",
        icon: "edit",
        align: "between",
        action: editAddAddress,
      },
      {
        label: "Eliminar",
        icon: "delete",
        align: "between",
        color: "secondary",
        action: deleteAddress,
      },
    ];
    const buttonsHeader = [
      {
        label: "Añadir dirección",
        icon: "add",
        align: "between",
        action: editAddAddress,
      },
    ];
    function editAddAddress(id) {
      if (id != undefined) {
        router.push({ name: "editAddress", params: { id: id } });
      } else {
        router.push({ name: "addAddress" });
      }
    }
    function deleteAddress(id) {
      if (id != undefined) {
        $q.dialog({
          title: "Confirmar",
          message: `¿Desea eliminar la dirección?`,
          cancel: "Cancelar",
          ok: "Aceptar",
          persistent: true,
        }).onOk(() => {
          maps.deleteAddress(id);
        });
      }
    }
    return {
      router,
      addresses,
      columns,
      buttonsHeader,
      buttonsRows,
    };
  },
};
</script>
