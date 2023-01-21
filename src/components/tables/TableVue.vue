<template>
  <div class="q-pa-md">
    <q-table
      ref="tableRef"
      :grid="false"
      flat
      bordered
      class="q-px-sm"
      style="height: 450px"
      :title="ptitle"
      :rows="rows"
      :columns="columns"
      row-key="id"
      :virtual-scroll="scroll"
      v-model:pagination="paginations"
      :filter="filter"
      :loading="loading"
      binary-state-sort
      @request="onRequest"
    >
      <template v-slot:top-right>
        <div class="row q-gutter-md">
          <q-input
            class="col md-1"
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="Buscar"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn
            v-for="b in buttonsHeader"
            :key="b"
            outline
            class=".col-md md-2"
            :label="b.label"
            :icon="b.icon"
            @click="b.action"
          />
        </div>
      </template>
      <template v-slot:body-cell-actions="scope">
        <q-td :props="scope" class="q-gutter-xs">
          <q-btn
            v-for="b in buttonsRows"
            outline
            :key="b"
            :label="b.label"
            :icon="b.icon"
            :color="b.color"
            v-model="scope.row"
            @click="b.action(scope.row.id)"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import { ref, toRef, toRefs, onMounted } from "vue";

export default {
  props: {
    pcolumns: { type: Array, required: true },
    prows: { type: Array, required: false },
    ptitle: { type: String, required: false },
    onRequest: { type: Function, required: false },
    loading: { type: Boolean, required: false, default: false },
    pagination: { type: Object, required: false },
    scroll: { type: Boolean, required: false, default: false },
    buttonsRows: { type: Array, required: false },
    buttonsHeader: { type: Array, required: false },
  },

  setup(props, ctx) {
    const tableRef = ref();
    const filter = ref("");
    const rows = toRef(props, "prows");
    const { pcolumns } = toRefs(props);
    const columns = pcolumns.value;
    const paginations = toRef(props, "pagination");
    onMounted(() => {
      // get initial data from server (1st page)
      tableRef.value.requestServerInteraction();
    });
    return {
      tableRef,
      props,
      columns,
      rows,
      paginations,
      filter,
    };
  },
};
</script>

<style lang="sass">
.my-sticky-dynamic
  /* height or max-height is important */
  height: 410px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #fff

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0
</style>
