<template>
  <q-layout view="hHh Lpr fFf">
    <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-header elevated>
      <q-toolbar>
        <q-btn flat round dense icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="row">
          <q-avatar>
            <q-img height="48px" src="src/assets/icons/chef_hat.png" />
          </q-avatar>
          <div>
            Gustó Recepción
            <div class="text-caption q-ma-none" style="padding-left: 3px">
              Tienda de comida online
            </div>
          </div>
        </q-toolbar-title>
        <div class="row">
          <notification-vue />
          <avatar-icon-vue />
        </div>
      </q-toolbar>
    </q-header>

    <!-- (Optional) A Drawer; you can add one more with side="right" or change this one's side -->
    <q-drawer v-model="leftDrawerOpen" side="left" bordered class="bg-grey-2">
      <!-- QScrollArea is optional -->
      <q-scroll-area class="fit q-pa-sm">
        <!-- Content here -->
        <q-list padding class="menu-list">
          <q-item
            clickable
            v-ripple
            @click="$router.push({ name: `receptionOrders` })"
          >
            <q-item-section avatar>
              <q-icon :name="biReceiptCutoff" />
            </q-item-section>

            <q-item-section> Recepción de pedidos </q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="$router.push({ name: `maps` })">
            <q-item-section avatar>
              <q-icon :name="biMap" />
            </q-item-section>

            <q-item-section> Validación de direcciones </q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="goHome">
            <q-item-section avatar>
              <q-icon name="store" />
            </q-item-section>

            <q-item-section> Tienda Gustó </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <!-- This is where pages get injected -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";

import AvatarIconVue from "src/components/AvatarIcon.vue";
import NotificationVue from "src/components/buttons/NotificationsVue.vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { biReceiptCutoff, biMap } from "@quasar/extras/bootstrap-icons";
import { useAuthStore } from "src/stores/auth";
import { useNotifyStore } from "src/stores/notifications";
import { storeToRefs } from "pinia";

export default {
  // name: 'LayoutName',
  components: {
    AvatarIconVue,
    NotificationVue,
  },
  beforeRouteEnter(to, from) {
    const auth = useAuthStore();
    if (!auth.isAutenticatedNow || !auth.isRecepcionist) {
      return { name: "notFound" };
    }
  },
  created() {
    if (!this.connected) {
      this.notifications.connect();
    }
  },
  setup() {
    const notifications = useNotifyStore();
    const { connected } = storeToRefs(notifications);
    const leftDrawerOpen = ref(false);
    const router = useRouter();
    const $q = useQuasar();
    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      goHome() {
        $q.dialog({
          title: "Confirmar",
          message: `¿Desea salir de la página de recepción de pedidos?`,
          cancel: "Cancelar",
          ok: "Aceptar",
          persistent: true,
        }).onOk(() => {
          router.push({ name: `home` });
        });
      },
      biReceiptCutoff,
      biMap,
      notifications,
      connected,
    };
  },
};
</script>
