<template>
  <q-form @submit="updateUser">
    <q-markup-table class="no-shadow">
      <tbody>
        <tr>
          <td class="text-left">Nombre</td>
          <td class="text-right">
            {{ me.name }}
            <q-popup-edit v-model="me.name" auto-save v-slot="scope">
              <q-input
                v-model="scope.value"
                dense
                autofocus
                :rules="[
                  (val) => (val && val.length > 0) || `Por favor escriba algo`,
                ]"
              />
            </q-popup-edit>
          </td>
        </tr>
        <tr>
          <td class="text-left">Apellidos</td>
          <td class="text-right">
            {{ me.last_name }}
            <q-popup-edit v-model="me.last_name" auto-save v-slot="scope">
              <q-input
                v-model="scope.value"
                dense
                autofocus
                :rules="[
                  (val) => (val && val.length > 0) || `Por favor escriba algo`,
                ]"
              />
            </q-popup-edit>
          </td>
        </tr>
        <tr>
          <td class="text-left">Correo electrónico</td>
          <td class="text-right">
            {{ `${me.email.substring(0, 22)}...` }}
            <q-popup-edit
              v-model.string="me.email"
              auto-save
              v-slot="scope"
              :validate="emailValidation"
              @hide="emailValidation"
            >
              <q-input
                type="email"
                v-model.number="scope.value"
                dense
                autofocus
                :error="errorEmail"
                :error-message="errorMessageEmail"
              />
            </q-popup-edit>
          </td>
        </tr>
        <tr>
          <td class="text-left">Teléfono</td>
          <td class="text-right">
            {{ me.phone }}
            <q-popup-edit
              v-model.number="me.phone"
              auto-save
              v-slot="scope"
              :validate="phoneValidation"
              @hide="phoneValidation"
            >
              <q-input
                v-model.number="scope.value"
                dense
                autofocus
                mask="(##) ### - ###"
                unmasked-value
                :error="errorPhone"
                :error-message="errorMessagePhone"
              />
            </q-popup-edit>
          </td>
        </tr>
      </tbody>
    </q-markup-table>
    <div class="row justify-center q-pa-md">
      <q-btn
        class="q-ma-md"
        style="width: 100%"
        color="primary"
        :icon="biGeoAltFill"
        label="Direcciones"
        @click="[this.$bus.emit(`add-address`), routerDialog.count++]"
      />
    </div>
    <q-separator inset />
    <div class="row justify-center q-pa-md">
      <q-btn type="submit" label="Save" />
    </div>
  </q-form>
</template>
<script>
import { defineComponent, ref } from "vue";
import { Notify } from "quasar";

import { useRouterDialogStore } from "src/stores/router-dialog";
import { useProfileStore } from "src/stores/profile";

import { biGeoAltFill } from "@quasar/extras/bootstrap-icons";
import { storeToRefs } from "pinia";

export default defineComponent({
  setup() {
    const routerDialog = useRouterDialogStore();
    const profile = useProfileStore();
    const errorEmail = ref(false);
    const errorMessageEmail = ref("");
    const errorPhone = ref(false);
    const errorMessagePhone = ref("");
    const { getUser } = storeToRefs(profile);
    return {
      routerDialog,
      biGeoAltFill,
      errorEmail,
      errorMessageEmail,
      errorPhone,
      errorMessagePhone,
      me: getUser,
      updateUser() {
        try {
          profile.editUser(me.value);
          Notify.create({
            message: "Submited",
            color: "info",
          });
        } catch (error) {
          console.log(error);
        }
      },
    };
  },
  methods: {
    emailValidation(val) {
      if (!val.includes("@")) {
        this.errorEmail = true;
        this.errorMessageEmail = "Debe contener @";
        return false;
      }
      this.errorEmail = false;
      this.errorMessageEmail = "";
      return true;
    },
    phoneValidation(val) {
      if (val.toString().length < 8) {
        this.errorPhone = true;
        this.errorMessagePhone = "Debe contener 8 dígitos";
        return false;
      }
      this.errorPhone = false;
      this.errorMessagePhone = "";
      return true;
    },
  },
});
</script>
