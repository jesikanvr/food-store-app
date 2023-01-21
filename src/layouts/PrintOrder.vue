<template>
  <q-layout class="bg-grey" view="hHh Lpr fFf">
    <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title class="q-ml-xl text-h6"> Facturación </q-toolbar-title>
        <div class="q-mr-xl">
          <q-btn @click="imprimir" outline>Imprimir</q-btn>
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <!-- This is where pages get injected -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  // name: 'LayoutName',

  setup() {
    return {};
  },
  methods: {
    imprimir() {
      this.$bus.emit("print");
    },
  },
};
</script>
