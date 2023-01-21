<template>
  <div>
    <div style="height: 400; max-width: 300px">
      <q-card class="q-pa-md" flat bordered>
        <q-card-section class="text-h5"
          >Intruduzca su nueva contraseña</q-card-section
        >
        <q-card-section>
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
            <q-input
              v-model="password"
              label="Su nueva contraseña *"
              :type="isPwd ? 'password' : 'text'"
              :rules="[
                (val) => (val && val.length > 0) || `Por favor escriba algo`,
                (val) => val.length >= 8 || `Debe contener al menos 8 dígitos`,
              ]"
              dense
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                /> </template
            ></q-input>
            <q-input
              v-model="confirmPassword"
              label="Confirme su contraseña*"
              :type="isPwd ? 'password' : 'text'"
              :rules="[
                (val) => (val && val.length > 0) || `Por favor escriba algo`,
                (val) => val.length >= 8 || `Debe contener al menos 8 dígitos`,
                (val) => val == password || `Las contraseñas deben coincidir`,
              ]"
              dense
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                /> </template
            ></q-input>
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
import { defineComponent, ref, toRefs } from "vue";

export default defineComponent({
  props: {
    token: { type: String, required: true },
  },
  setup(props, ctx) {
    const password = ref(null);
    const confirmPassword = ref(null);
    const auth = useAuthStore();
    const { changePassword } = auth;

    const { token } = toRefs(props);
    return {
      password,
      confirmPassword,
      isPwd: ref(true),
      async onSubmit() {
        try {
          await changePassword(
            password.value,
            confirmPassword.value,
            token.value
          );
          Notify.create({
            color: "info",
            message: "Cambio de contraseña exitoso",
          });
          ctx.emit("select");
        } catch (error) {
          console.log(error);
          Notify.create({
            color: "warning",
            message: "Las contraseñas deben coincidir",
          });
        }
      },
      onReset() {
        password.value = null;
        confirmPassword.value = null;
      },
    };
  },
});
</script>
