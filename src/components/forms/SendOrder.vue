<template>
  <div class="q-pa-md">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-select
        table-colspan="3"
        name="selected_address"
        v-model="accepted"
        multiple
        :options="options"
        color="primary"
        filled
        label="Escoja las direcciones de entrega"
        @focus="order.generateAddressOptions()"
        :disable="!isAutenticatedNow"
        use-chips
        :rules="[(val) => val.length > 0 || `Campo obligatorio`]"
        ><template v-slot:after>
          <q-btn round dense flat icon="add" @click="addAddress()" /> </template
      ></q-select>
      <q-input
        name="selected_phone"
        v-model="phone"
        color="primary"
        filled
        :rules="[
          (val) => !!val || `Campo obligatorio`,
          (val) => val.length >= 8 || `Debe contener 8 dígitos`,
        ]"
        lazy-rules
        mask="(##) ### - ###"
        unmasked-value
        label="Contacto"
        :disable="!isAutenticatedNow"
      >
        <template v-slot:append>
          <q-btn
            round
            dense
            flat
            icon="add"
            @click="phone = getPhone"
          /> </template
      ></q-input>
      <div>
        <q-btn
          label="Enviar"
          type="submit"
          color="primary"
          :disable="!isAutenticatedNow"
        />
      </div>
    </q-form>
    <div>
      <q-card
        v-if="submitResult.length > 0"
        flat
        bordered
        class="q-mt-md bg-grey-2"
        style="width: 400px"
      >
        <q-card-section>
          <q-icon class="q-ma-sm" name="verified" size="32px" />
          Gracias por comprar con Gustó. Su pedido llegará lo más pronto
          posible.
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { Notify } from "quasar";

import { defineComponent } from "vue";

import { storeToRefs } from "pinia";

import { useOrdersStore } from "src/stores/orders";
import { useProfileStore } from "src/stores/profile";
import { useAuthStore } from "src/stores/auth";

export default defineComponent({
  beforeCreate() {
    if (this.isAutenticatedNow) {
      this.order.generateAddressOptions();
    }
  },
  setup(props, ctx) {
    const submitEmpty = ref(false);
    const submitResult = ref([]);

    const phone = ref(null);
    const accepted = ref([]);

    const order = useOrdersStore();
    const { getAddressOptions, canBeSent } = storeToRefs(order);

    const profile = useProfileStore();
    const { getPhone } = storeToRefs(profile);

    const auth = useAuthStore();
    const { isAutenticatedNow } = storeToRefs(auth);

    return {
      preferred: ref("rock"),
      accepted,
      order,
      options: getAddressOptions,
      canBeSent,
      phone,
      getPhone,

      submitEmpty,
      submitResult,

      isAutenticatedNow,

      onSubmit(evt) {
        if (canBeSent.value) {
          const formData = new FormData(evt.target);
          const data = [];

          for (const [name, value] of formData.entries()) {
            data.push({
              name,
              value,
            });
          }

          submitResult.value = data;
          submitEmpty.value = data.length === 0;
          try {
            order.sendOrder(data);
            Notify.create({
              message: "Pedido enviado",
              color: "info",
            });
          } catch (error) {
            Notify.create({
              message: error,
              color: "negative",
            });
          }
        } else {
          Notify.create({
            message: "Por favor, seleccione algún producto",
            color: "warning",
          });
        }
      },
      addAddress() {
        ctx.emit("add");
      },
    };
  },
  methods: {
    openFormAddPhone() {
      console.log("Acción 2");
    },
  },
});
</script>
