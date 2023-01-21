<template>
  <q-page padding>
    <!-- content -->
    <table-vue-vue
      :pcolumns="columns"
      :prows="reports"
      :buttonsRows="buttonsRows"
      :buttonsHeader="buttonsHeader"
      ptitle="Reportes de ventas"
      :ptype="{ pronoun: `el`, name: `reporte` }"
      :loading="loading"
    />
  </q-page>
</template>

<script>
import { ref } from "vue";

import TableVueVue from "src/components/tables/TableVue.vue";

import { useRouter } from "vue-router";
import { useReportsStore } from "src/stores/reports";
import { storeToRefs } from "pinia";
import {
  biFileEarmarkSpreadsheet,
  biFiletypePdf,
} from "@quasar/extras/bootstrap-icons";
import { useQuasar } from "quasar";

export default {
  // name: 'PageName',
  components: {
    TableVueVue,
  },
  beforeCreate() {
    this.report.getAllReports();
  },
  setup() {
    const router = useRouter();
    const $q = useQuasar();
    const report = useReportsStore();
    const { reports } = storeToRefs(report);
    const loading = ref(false);
    const columns = [
      {
        name: "type",
        required: true,
        label: "Tipo de reporte",
        align: "left",
        field: "type",
        sortable: true,
      },
      {
        name: "start",
        align: "left",
        label: "Inicio",
        field: "startDate",
        sortable: true,
      },
      {
        name: "end",
        align: "left",
        label: "Final",
        field: "endDate",
        sortable: true,
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
        label: "Exportar Excel",
        align: "between",
        color: "green",
        icon: biFileEarmarkSpreadsheet,
        action: exportExcel,
      },
      {
        label: "Exportar PDF",
        align: "between",
        color: "primary",
        icon: biFiletypePdf,
        action: exportPDF,
      },
      {
        label: "Eliminar",
        icon: "delete",
        align: "between",
        color: "secondary",
        action: deleteReport,
      },
    ];
    const buttonsHeader = [
      {
        label: "Generar reporte",
        icon: "add",
        align: "between",
        action: generateReport,
      },
    ];
    async function exportExcel(id) {
      loading.value = true;
      await report.exportExcel(id).then(() => {
        loading.value = false;
      });
    }
    async function exportPDF(id) {
      loading.value = true;
      await report.exportPDF(id).then(() => {
        loading.value = false;
      });
    }
    function deleteReport(id) {
      $q.dialog({
        title: "Confirmar",
        message: `¿Desea eliminar el reporte?`,
        cancel: "Cancelar",
        ok: "Aceptar",
        persistent: true,
      }).onOk(() => {
        report.deleteReport(id);
      });
    }
    function generateReport() {
      router.push({ name: "generateReport" });
    }
    return {
      columns,
      buttonsRows,
      buttonsHeader,
      report,
      reports,
      loading,
    };
  },
};
</script>
