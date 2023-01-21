<template>
  <div class="q-pa-md">
    <q-table
      flat
      style="height: 400px"
      title="Productos"
      :rows="rows"
      :columns="columns"
      row-key="name"
      virtual-scroll
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
      selection="multiple"
      v-model:selected="selected"
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </div>
</template>

<script>
import { ref } from "vue";

const columns = [
  {
    name: "name",
    required: true,
    label: "Nombre",
    align: "left",
    field: "name",
    sortable: true,
  },
];

export default {
  props: {
    rows: {
      type: Array,
      required: false,
      default: () => {
        return [];
      },
    },
  },
  setup() {
    const selected = ref([]);
    return {
      columns,
      filter: ref(""),
      pagination: ref({
        rowsPerPage: 0,
      }),
      selected,
    };
  },
  watch: {
    selected: {
      handler: function (newVal, oldVal) {
        this.$emit("add", newVal);
      },
      deep: true,
    },
  },
};
</script>
