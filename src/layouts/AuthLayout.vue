<template>
  <q-layout padding align="center">
    <!-- content -->
    <div>
      <q-img
        src="src/assets/icons/chef_hat.png"
        style="height: 180px; max-width: 200px; cursor: pointer"
        @click="router.push({ path: `/` })"
      />
    </div>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    return {
      router,
    };
  },
};
</script>
