<template>
  <router-view />
</template>

<script>
import { defineComponent } from "vue";

import { useAuthStore } from "stores/auth";
import { storeToRefs } from "pinia";
import { api } from "./boot/axios";

export default defineComponent({
  name: "App",
  beforeCreate() {
    this.init();
    if (this.getToken) {
      api.defaults.headers.common["Authorization"] = `Bearer${this.getToken}`;
    } else {
      api.defaults.headers.common["Authorization"] = "";
    }
  },
  setup() {
    const store = useAuthStore();
    const { getToken } = storeToRefs(store);
    const { init } = store;
    return {
      getToken,
      init,
    };
  },
});
</script>
