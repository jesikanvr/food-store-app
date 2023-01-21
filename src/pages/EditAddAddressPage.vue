<template>
  <q-page padding>
    <!-- content -->
    <div class="q-mt-xl" align="center">
      <edit-address-form-vue :address="address" @save="goBack" />
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";

import EditAddressFormVue from "src/components/forms/EditAddAddressForm.vue";
import { useMapsStore } from "src/stores/maps";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

export default defineComponent({
  // name: 'PageName',
  components: {
    EditAddressFormVue,
  },
  props: {
    id: { type: Number, required: false },
  },
  beforeCreate() {
    if (this.existAddress(this.id)) {
      this.address = this.getAddressById(this.id);
    } else {
      const router = useRouter();
      router.push({ name: "notFound" });
    }
  },
  setup() {
    const router = useRouter();
    const maps = useMapsStore();
    const { getAddressById, existAddress } = storeToRefs(maps);
    const address = ref({});
    return {
      maps,
      getAddressById,
      existAddress,
      address,
      goBack() {
        router.back();
      },
    };
  },
});
</script>
