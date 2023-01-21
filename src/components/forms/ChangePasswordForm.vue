<template>
  <div>
    <div style="height: 400; max-width: 300px">
      <q-card class="q-pa-md" flat bordered>
        <q-card-section class="text-h5"
          >Asistencia de contraseña
        </q-card-section>
        <q-card-section class="on-left" align="left">
          Ingrese la dirección de correo electrónico o nombre de usuario
          asociado con su cuenta de Gustó.
        </q-card-section>
        <q-card-section>
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
            <q-input
              v-model="nameuserOrEmail"
              label="Nombre de usuario o correo *"
              :rules="[
                (val) => (val && val.length > 0) || `Por favor escriba algo`,
              ]"
            />
            <div>
              <q-btn label="Enviar" type="submit" color="primary" />
              <q-btn
                label="Reiniciar"
                type="reset"
                color="primary"
                flat
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script>
import { Notify } from "quasar";
import { useAuthStore } from "src/stores/auth";
import { defineComponent, ref } from "vue";

import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const router = useRouter();
    const nameuserOrEmail = ref(null);
    const auth = useAuthStore();
    const { sendEmailChangePassword } = auth;

    return {
      nameuserOrEmail,
      router,
      async onSubmit() {
        await sendEmailChangePassword(nameuserOrEmail.value).then(() => {
          router.push({ path: "/auth/login" });
        });
      },
      onReset() {
        nameuserOrEmail.value = null;
      },
    };
  },
});
</script>
