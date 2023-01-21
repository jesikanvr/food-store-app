<template>
  <div>
    <div style="height: 400; max-width: 310px">
      <q-card flat bordered>
        <q-card-section class="text-h5">Iniciar sesión</q-card-section>
        <q-card-section>
          <form-vue-vue :data="data" @submit="onSubmit" @reset="onReset">
            <template v-slot:select>
              <div>
                <q-input
                  v-model="password"
                  label="Contraseña"
                  :type="isPwd ? 'password' : 'text'"
                  :rules="[
                    (val) =>
                      (val && val.length > 0) || `Por favor escriba algo`,
                  ]"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    /> </template
                ></q-input>
              </div>
            </template>
          </form-vue-vue>
        </q-card-section>
        <q-card-section>
          <router-link class="change_pass" to="/auth/change-password">
            ¿Olvidó su contraseña?
          </router-link>
        </q-card-section>
      </q-card>
      <div>
        <q-separator class="q-mt-lg q-mb-md" />
        <div>
          <q-btn
            color="grey"
            unelevated
            label="Crear tu cuenta en Gustó"
            no-caps
            @click="router.push(`/auth/register`)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { useAuthStore } from "src/stores/auth";
import { defineComponent, ref } from "vue";

import { useRouter } from "vue-router";

import FormVueVue from "./FormVue.vue";

export default defineComponent({
  components: {
    FormVueVue,
  },
  data() {
    const data = {
      inputs: [
        {
          index: 0,
          label: "Nombre de usuario",
          name: "username",
          value: ref(null),
          rules: [(val) => (val && val.length > 0) || `Por favor escriba algo`],
        },
      ],
      buttons: [
        { index: 0, label: "Iniciar sesión", type: "submit", color: "primary" },
        {
          index: 1,
          label: "Reiniciar",
          type: "reset",
          color: "primary",
          flat: true,
        },
      ],
    };
    return { data };
  },
  setup() {
    const router = useRouter();
    const auth = useAuthStore();
    const { doLogin } = auth;
    const password = ref(null);

    return {
      router,
      password,
      isPwd: ref(true),
      onSubmit(data) {
        doLogin(
          {
            usernameOrEmail: data[0].value,
            password: password.value,
          },
          router
        );
      },
      onReset() {
        password.value = null;
      },
    };
  },
});
</script>
<style lang="scss">
.change_pass {
  text-decoration: none;
}
.change_pass:hover {
  text-decoration: underline;
}
</style>
