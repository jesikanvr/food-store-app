<template>
  <q-page padding>
    <!-- content -->
    <change-password-form-vue />
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

import ChangePasswordFormVue from "components/forms/ChangePasswordForm.vue";

export default defineComponent({
  // name: 'PageName',
  components: {
    ChangePasswordFormVue,
  },
});
</script>
