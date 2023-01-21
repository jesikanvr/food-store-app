<template>
  <q-footer color="secondary" style="height: 150px">
    <q-toolbar
      class="content-center row justify-start"
      color="primary"
      style="height: 50px; width: 100%; align-items: center"
    >
      <q-toolbar-title class="footer-title row justify-center q-py-md q-mt-lg">
        <p>Trabajar con nosotros</p>
        <q-separator vertical inset />
        <p>Conoce Gustó</p>
        <q-separator vertical inset />
        <p>E-factura proveedores</p>
      </q-toolbar-title>
    </q-toolbar>
    <q-toolbar>
      <q-toolbar-title class="row justify-center q-mt-xl">
        <div>
          <q-icon class="q-ml-md" :name="bi_in" size="30px" />
          <q-icon class="q-ml-md" :name="bi_tw" size="30px" />
          <q-icon class="q-ml-md" :name="bi_fa" size="30px" />
        </div>
      </q-toolbar-title>
    </q-toolbar>
  </q-footer>
</template>
<script>
import { defineComponent } from "vue";

import {
  biTwitter,
  biFacebook,
  biInstagram,
} from "@quasar/extras/bootstrap-icons";

export default defineComponent({
  name: "FooterIndex",
  setup() {
    const bi_tw = biTwitter;
    const bi_fa = biFacebook;
    const bi_in = biInstagram;
    return {
      bi_tw,
      bi_fa,
      bi_in,
    };
  },
});
</script>
<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Montserrat&display=swap");
.footer-title {
  height: 50px;
  width: 200px;
}
.footer-title p {
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 20px;
  margin-right: 20px;
}
</style>
