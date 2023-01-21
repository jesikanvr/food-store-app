<template>
  <div>
    <div>
      <q-card
        class="q-mb-xl"
        flat
        bordered
        style="height: 400; max-width: 310px"
      >
        <q-card-section class="text-h5">Crear cuenta</q-card-section>
        <q-card-section>
          <FormVueVue :data="data" @submit="onSubmit" @reset="onReset">
            <template v-slot:select>
              <div>
                <q-input
                  v-model="password"
                  label="Contraseña"
                  :type="isPwd ? 'password' : 'text'"
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || `Por favor, escriba algo`,
                    (val) =>
                      (val && val.length > 8) ||
                      `Debe contener al menos 8 caracteres`,
                  ]"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    /> </template
                ></q-input>

                <q-toggle
                  class="float-left q-mb-lg"
                  v-model="accept"
                  label="Acepto los términos"
                />
              </div>
            </template>
          </FormVueVue>
        </q-card-section>
        <q-card-section>
          <div>
            ¿Ya tiene una cuenta?
            <RouterLink to="/auth/login">Iniciar sesión</RouterLink>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref } from "vue";
import { Notify } from "quasar";

import { useAuthStore } from "src/stores/auth";
import { RouterLink, useRouter } from "vue-router";

import FormVueVue from "components/forms/FormVue.vue";

export default defineComponent({
  components: {
    RouterLink,
    FormVueVue,
  },
  data() {
    const data = {
      inputs: [
        {
          index: 0,
          label: "Nombre",
          name: "name",
          value: ref(null),
          rules: [
            (val) => (val && val.length > 0) || `Por favor escriba algo`,
            (val) =>
              /^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/.exec(val) ||
              `Por favor, solo letras`,
          ],
        },
        {
          index: 1,
          label: "Apellidos",
          name: "last_name",
          value: ref(null),
          rules: [
            (val) => (val && val.length > 0) || `Por favor escriba algo`,
            (val) =>
              /^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/.exec(val) ||
              `Por favor, solo letras`,
          ],
        },
        {
          index: 2,
          label: "Nombre de usuario",
          name: "username",
          value: ref(null),
          rules: [(val) => (val && val.length > 0) || `Por favor escriba algo`],
        },
        {
          index: 3,
          label: "Correo electrónico",
          name: "email",
          value: ref(null),
          rules: [
            (val) => (val && val.length > 0) || `Por favor, escriba algo`,
            (val) => /^\w+@(\w+\.)+\w{2,4}$/.exec(val) || `Correo invalido`,
          ],
        },
      ],
      buttons: [
        { index: 0, label: "Registrar", type: "submit", color: "primary" },
        {
          index: 1,
          label: "Reiniciar",
          type: "reset",
          color: "primary",
          flat: true,
        },
      ],
    };
    return {
      data,
    };
  },
  setup() {
    const router = useRouter();
    const auth = useAuthStore();
    const { registerUser } = auth;
    const password = ref(null);
    const accept = ref(false);

    return {
      router,
      password,
      accept,
      registerUser,
      isPwd: ref(true),
      async onSubmit(data) {
        if (accept.value !== true) {
          Notify.create({
            color: "warning",
            icon: "warning",
            message: "Debe aceptar los términos",
          });
        } else {
          await registerUser(
            {
              name: data[0].value,
              last_name: data[1].value,
              user: data[2].value,
              email: data[3].value,
              pass: password.value,
            },
            router
          );
        }
      },
      onReset() {
        password.value = null;
        accept.value = false;
      },
    };
  },
});
</script>
