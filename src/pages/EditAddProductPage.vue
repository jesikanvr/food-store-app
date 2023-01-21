<template>
  <q-page padding>
    <!-- content -->
    <div :class="[isDesktop ? `q-ma-xl` : `q-ma-sm`, `q-pb-md`]">
      <q-card class="q-pb-md" bordered flat>
        <div class="text-h5 q-ma-sm" style="margin-left: 20px">
          {{ isEditing ? "Detalles del producto" : "Nuevo producto" }}
        </div>
        <form-vue-vue
          class="q-gutter-md"
          :data="inputs"
          @submit="editAddProduct"
        >
          <template v-slot:left>
            <div class="q-gutter-sm" style="margin: 20px">
              <ProductCardVue :product="product" :isEditing="true">
                <template v-slot:uploader> </template>
              </ProductCardVue>
            </div>
          </template>
          <template v-slot:select>
            <div>
              <FilePickerVueVue
                @add="uploadImgProduct"
                :rules="[
                  (val) => val.length < 1 || 'Please use maximum 3 characters',
                ]"
              />
              <q-toggle v-model="onSales" />¿Desesa poner el producto en venta?
            </div>
          </template>
        </form-vue-vue>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { storeToRefs } from "pinia";

import FormVueVue from "src/components/forms/FormVue.vue";

import { ref } from "vue";

import { useProductsStore } from "src/stores/products";

import ProductCardVue from "src/components/cards/ProductCard.vue";
// import UploaderVueVue from "src/components/uploader/UploaderVue.vue";
import FilePickerVueVue from "src/components/file-picker/FilePickerVue.vue";

import { Notify, useQuasar } from "quasar";
import { useRouter } from "vue-router";

export default {
  // name: 'PageName',
  components: {
    FormVueVue,
    ProductCardVue,
    // UploaderVueVue,
    FilePickerVueVue,
  },
  props: {
    id: { type: Number, required: false },
  },
  beforeCreate() {
    if (this.exitProduct(this.id)) {
      this.product = Object.assign({}, this.getProductById(this.id));
      this.onSales = this.product.onSale;
    } else {
      const router = useRouter();
      router.push({ name: "notFound" });
    }
    this.$bus.on("updated", (data) => {
      this.product.name = data[0].value;
      this.product.price = data[1].value;
      this.product.description = data[2].value;
    });
  },
  beforeRouteLeave(to, from, next) {
    if (this.isSave == false) {
      this.$q
        .dialog({
          title: "Confirmar",
          message: "¿Desea salir sin guardar el producto?",
          cancel: "Cancelar",
          ok: "Aceptar",
          persistent: true,
        })
        .onOk(() => {
          next();
        })
        .onCancel(() => {
          next(false);
        });
    } else {
      next();
    }
  },
  data() {
    const inputs = {
      inputs: [
        {
          index: 0,
          label: "Nombre",
          name: "name",
          value: this.product.name ? this.product.name : null,
          rules: [(val) => !!val || "Campo requerido"],
        },
        {
          index: 1,
          label: "Precio",
          name: "price",
          value: this.product.price ? this.product.price : null,
          rules: [
            (val) => !!val || "Campo requerido",
            (val) => val > 0 || `Por favor entre un precio real`,
          ],
        },
        {
          index: 2,
          label: "Descripción",
          name: "description",
          value: this.product.description ? this.product.description : null,
          rules: [
            (val) => !!val || "Campo requerido",
            (val) =>
              val.length <= 110 || "Por favor, use un máximo de 110 caracteres",
          ],
        },
      ],
      buttons: [
        {
          index: 0,
          label: this.id != undefined ? "Editar" : "Guardar",
          type: "submit",
          color: "primary",
        },
      ],
    };
    return {
      inputs,
    };
  },
  setup(props) {
    const router = useRouter();
    const products = useProductsStore();
    const { getProductById, exitProduct, imgServer } = storeToRefs(products);
    const { updateProduct, uploadImage, deleteImage } = products;
    const product = ref({});
    const $q = useQuasar();
    const isEditing = props.id != undefined ? true : false;
    const isSave = ref(false);
    const file = ref(null);
    return {
      router,
      getProductById,
      exitProduct,
      imgServer,
      updateProduct,
      uploadImage,
      deleteImage,
      product,
      file,

      isMobile: $q.platform.is.mobile,
      isDesktop: $q.platform.is.desktop,
      onSales: ref(false),
      isEditing,
      isSave,
    };
  },
  methods: {
    uploadImgProduct(file) {
      if (file != null) {
        this.file = file;
        this.product.imgUrl = URL.createObjectURL(file);
      } else if (file == null) {
        this.file = null;
        this.product.imgUrl = null;
      }
    },
    editAddProduct(data) {
      if (this.file != null || this.product.imgName != null) {
        if (data != undefined) {
          this.isSave = true;
          /**
           * Esto es para poder borrar la imagen anterior del producto
           * en caso de que se esté editando
           */
          const temp = this.product.imgName;
          const edited = {
            id: this.product.id,
            name: data[0].value,
            price: data[1].value,
            description: data[2].value,
            onSale: this.onSales,
            imgUrl:
              this.file != null
                ? this.imgServer + this.file.name
                : this.imgServer + this.product.imgName,
            imgName: this.file != null ? this.file.name : this.product.imgName,
          };
          this.updateProduct(edited, this.router);
          this.uploadImage(this.file);
          /**
           * Aqui termino de borrar la imagen anterior
           */
          if (this.isEditing && this.file != null) {
            this.deleteImage(temp, this.isEditing);
          }
        } else {
          Notify.create({
            color: "warning",
            icon: "warning",
            message: "Por favor agregue una imagen al producto",
          });
        }
      } else {
        Notify.create({
          color: "warning",
          message: "Debe escoger una imagen para el producto",
        });
      }
    },
  },
};
</script>
