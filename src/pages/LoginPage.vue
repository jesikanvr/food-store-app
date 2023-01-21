<template>
  <q-page padding>
    <!-- content -->
    <login-form-vue />
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

import LoginFormVue from "src/components/forms/LoginForm.vue";

export default defineComponent({
  // name: 'PageName',
  components: {
    LoginFormVue,
  },
});
</script>
