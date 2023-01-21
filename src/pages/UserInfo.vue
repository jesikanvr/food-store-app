<template>
  <q-page padding>
    <!-- content -->
    <div><basic-profile-info-vue :me="getUser" /></div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

import BasicProfileInfoVue from "src/components/tables/BasicProfileInfo.vue";
import { useProfileStore } from "src/stores/profile";
import { storeToRefs } from "pinia";

export default defineComponent({
  // name: 'PageName',
  components: {
    BasicProfileInfoVue,
  },
  setup() {
    const profile = useProfileStore();
    const { getUser } = storeToRefs(profile);
    return {
      getUser: Object.assign({}, getUser.value),
    };
  },
});
</script>
