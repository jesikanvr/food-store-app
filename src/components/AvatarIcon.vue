<template>
  <div class="q-pa-md q-gutter-md">
    <q-btn round @click="authActions()">
      <q-tooltip v-if="!isAutenticatedNow" :delay="1000">
        Autenticarse
      </q-tooltip>
      <q-tooltip v-else :delay="1000"> Perfil </q-tooltip>
      <q-avatar
        size="42px"
        font-size="25px"
        color="secondary"
        text-color="white"
        >{{ inicial }}
      </q-avatar>
      <profile-menu-vue
        v-if="isAutenticatedNow"
        :offset="[200, 5]"
        :inicial="inicial"
      />
    </q-btn>
  </div>
</template>
<script>
import { storeToRefs } from "pinia";
import { useAuthStore } from "src/stores/auth";
import { defineComponent, ref } from "vue";
import ProfileMenuVue from "./menus/ProfileMenu.vue";

export default defineComponent({
  name: "AvatarIcon",
  components: {
    ProfileMenuVue,
  },
  setup() {
    const auth = useAuthStore();
    const { isAutenticatedNow, inicial } = storeToRefs(auth);
    return {
      isAutenticatedNow,
      inicial,
      authActions() {
        if (!isAutenticatedNow.value) {
          this.$router.push({ path: "/auth/login" });
        }
      },
    };
  },
});
</script>
