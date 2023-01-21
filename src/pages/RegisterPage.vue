<template>
  <q-page padding>
    <!-- content -->
    <register-form-vue />
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

import RegisterFormVue from "src/components/forms/RegisterForm.vue";

export default defineComponent({
  // name: 'PageName',
  components: {
    RegisterFormVue,
  },
});
</script>
