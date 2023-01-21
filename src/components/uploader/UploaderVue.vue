<template>
  <q-uploader
    class=""
    :factory="uploadImage"
    auto-upload
    @added="setURL"
    @removed="removeURL"
    label="Cargar imagen de producto"
    field-name="file"
    accept="image/*"
    :max-file-size="20000000"
    :max-files="1"
    color="secondary"
    flat
    bordered
    style="max-width: 300px"
    no-thumbnails
  />
</template>
<script>
import { useProductsStore } from "src/stores/products";
import { defineComponent } from "vue";

export default defineComponent({
  setup(props, ctx) {
    const products = useProductsStore();
    const { uploadImage } = products;
    return {
      uploadImage,
      setURL(file) {
        ctx.emit("add", file[0].name);
      },
      removeURL(file) {
        ctx.emit("remove", file[0].name);
      },
    };
  },
});
</script>
