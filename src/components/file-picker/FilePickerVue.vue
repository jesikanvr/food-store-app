<template>
  <div class="q-pb-md">
    <q-file
      name="file"
      v-model="file"
      label="Cargar imagen del productos"
      bottom-slots
      accept=".jpg, image/*"
      max-file-size="20000000"
      @rejected="onRejected"
    >
      <template v-slot:prepend>
        <q-icon name="attach_file" />
      </template>
      <template v-slot:append>
        <q-btn flat round icon="clear" @click="file = null"></q-btn>
      </template>
    </q-file>
  </div>
</template>

<script>
import { Notify } from "quasar";
import { ref } from "vue";

export default {
  setup(props, ctx) {
    const file = ref(null);
    return {
      file,
      onRejected(rejectedEntries) {
        Notify.create({
          type: "negative",
          message: `${rejectedEntries.length} file(s) did not pass validation constraints`,
        });
      },
    };
  },
  watch: {
    file(newVal, oldVal) {
      this.$emit("add", this.file);
    },
  },
};
</script>
