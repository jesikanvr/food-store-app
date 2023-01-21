<template>
  <q-page padding>
    <!-- content -->
    <FinishChangePassFormVue :token="tokenPassword" @select="goLogin" />
  </q-page>
</template>

<script>
import { defineComponent, toRefs } from "vue";

import FinishChangePassFormVue from "src/components/forms/FinishChangePassForm.vue";
import { useRouter } from "vue-router";

export default defineComponent({
  // name: 'PageName',
  props: {
    tokenPassword: { type: String, required: true },
  },
  components: {
    FinishChangePassFormVue,
  },
  setup() {
    const router = useRouter();
    return {
      goLogin() {
        router.push({ path: "/auth/login" });
      },
    };
  },
});
</script>
