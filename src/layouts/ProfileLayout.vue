<template>
  <q-layout view="hHh Lpr fFf">
    <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-header reveal class="bg-white text-black shadow-2">
      <q-toolbar class="q-mt-sm">
        <q-btn flat round dense :icon="biArrowLeft" @click="goBack" />

        <q-toolbar-title> Sobre mí </q-toolbar-title>
      </q-toolbar>

      <q-tabs
        v-if="isUser"
        v-model="tab"
        dense
        inline-label
        class="bg-white text-black"
        shrink
        stretch
      >
        <q-route-tab
          name="info"
          icon="assignment"
          to="/profile/user-info"
          label="Información básica"
        />
        <q-route-tab
          name="addresses"
          icon="map"
          to="/profile/addresses"
          label="Direcciones de entrega"
        />
      </q-tabs>
    </q-header>

    <q-page-container>
      <!-- This is where pages get injected -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";

import { biArrowLeft } from "@quasar/extras/bootstrap-icons";
import { useAuthStore } from "src/stores/auth";
import { storeToRefs } from "pinia";

export default {
  // name: 'LayoutName',
  beforeMount() {},
  setup() {
    const router = useRouter();
    const auth = useAuthStore();
    const { isUser } = storeToRefs(auth);
    return {
      router,
      biArrowLeft,
      tab: ref("info"),
      goBack() {
        router.push({ path: "/" });
      },
      isUser,
    };
  },
};
</script>
