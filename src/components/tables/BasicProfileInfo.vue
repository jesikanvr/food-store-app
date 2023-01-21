<template>
  <div class="q-pa-xl" align="center">
    <q-markup-table
      :class="[`markup`, isDesktop ? `q-px-lg` : `q-px-xs`]"
      separator="horizontal"
      flat
      bordered
    >
      <thead>
        <tr>
          <div
            class="row no-wrap items-center q-my-lg justify-between"
            style="width: 100%"
          >
            <div class="text-h4 q-ml-md text-black">Información</div>
          </div>
        </tr>
      </thead>
      <tbody class="markup-body">
        <tr>
          <td v-if="isDesktop" class="text-left">Nombre</td>
          <td class="text-left">
            <div v-if="isMobile" class="text-overline">Nombre</div>
            {{ me.name }}
            <q-popup-edit
              class="popups"
              v-model="user.name"
              buttons
              v-slot="scope"
              :validate="() => !$refs.myInput.hasError"
              @save="editUser(user)"
            >
              <q-input
                v-model="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="scope.set"
                ref="myInput"
                :rules="[
                  (val) => !!val || `Campo obligatorio`,
                  (val) =>
                    /^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/.exec(val) ||
                    `Por favor, solo letras`,
                ]"
              />
            </q-popup-edit>
          </td>
          <td class="text-right">
            <q-icon size="20px" name="chevron_left" />
          </td>
        </tr>
        <tr>
          <td v-if="isDesktop" class="text-left">Apellidos</td>
          <td class="text-left">
            <div v-if="isMobile" class="text-overline">Apellidos</div>
            {{ me.last_name }}
            <q-popup-edit
              v-model="user.last_name"
              buttons
              label-set="Guardar"
              label-cancel="Cancelar"
              v-slot="scope"
              :validate="() => !$refs.myInput.hasError"
              @save="editUser(user)"
            >
              <q-input
                v-model="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="scope.set"
                ref="myInput"
                :rules="[
                  (val) => !!val || `Campo obligatorio`,
                  (val) =>
                    /^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/.exec(val) ||
                    `Por favor, solo letras`,
                ]"
              />
            </q-popup-edit>
          </td>
          <td class="text-right">
            <q-icon size="20px" name="chevron_left" />
          </td>
        </tr>
        <tr>
          <td v-if="isDesktop" class="text-left">Correo electrónico</td>
          <td class="text-left">
            <div v-if="isMobile" class="text-overline">Correo electrónico</div>
            {{ me.email }}
            <q-popup-edit
              v-model="user.email"
              buttons
              label-set="Guardar"
              label-cancel="Cancelar"
              :validate="() => !$refs.myInput.hasError"
              v-slot="scope"
              @save="editUser(user)"
            >
              <q-input
                type="email"
                v-model="scope.value"
                hint="Entre su correo"
                dense
                autofocus
                @keyup.enter="scope.set"
                ref="myInput"
                :rules="[
                  (value) => value.includes('@') || `Debe contener @`,
                  (val) =>
                    /^\w+@(\w+\.)+\w{2,4}$/.exec(val) || `Correo invalido`,
                ]"
              />
            </q-popup-edit>
          </td>
          <td class="text-right">
            <q-icon size="20px" name="chevron_left" />
          </td>
        </tr>
        <tr>
          <td v-if="isDesktop" class="text-left">Teléfono</td>
          <td class="text-left">
            <div v-if="isMobile" class="text-overline">Teléfono</div>
            {{ me.phone == null ? `No especificado` : me.phone }}
            <q-popup-edit
              v-model="user.phone"
              buttons
              v-slot="scope"
              :validate="() => !$refs.myInput.hasError"
              @save="editUser(user)"
            >
              <q-input
                v-model="scope.value"
                dense
                autofocus
                counter
                hint="Entre su teléfono"
                mask="(##) ### - ###"
                unmasked-value
                @keyup.enter="scope.set"
                ref="myInput"
                :rules="[
                  (val) => val.length >= 8 || `Debe contener 8 dígitos `,
                ]"
              />
            </q-popup-edit>
          </td>
          <td class="text-right">
            <q-icon size="20px" name="chevron_left" />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script>
import { defineComponent } from "vue";

import { useProfileStore } from "src/stores/profile";
import { useQuasar } from "quasar";
import { storeToRefs } from "pinia";

export default defineComponent({
  props: {
    userme: {
      type: Object,
      required: true,
    },
  },
  data(props) {
    const user = Object.assign({}, props.userme);
    return {
      user,
    };
  },
  setup() {
    const profile = useProfileStore();
    const { editUser } = profile;
    const { me } = storeToRefs(profile);
    const $q = useQuasar();
    return {
      editUser,
      me,
      isMobile: $q.platform.is.mobile,
      isDesktop: $q.platform.is.desktop,
    };
  },
});
</script>
<style>
.markup {
  height: 380px;
}
.markup-body {
  height: 250px;
}
.popups {
  max-width: 100px;
}
</style>
