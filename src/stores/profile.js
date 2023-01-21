import { defineStore } from "pinia";
import { Notify } from "quasar";
import { api } from "src/boot/axios";

import { useAuthStore } from "./auth";
import User from "./objects/User";

export const useProfileStore = defineStore("profile", {
  state: () => ({
    me: new User(),
    copyMe: new User(),
  }),

  getters: {
    getUser(state) {
      return state.me;
    },
    getPhone(state) {
      return state.me.phone;
    },
  },

  actions: {
    async editUser(userEdited) {
      try {
        console.log(userEdited);
        const data = await (
          await api.put(`/users/edit/${userEdited.id}`, userEdited)
        ).data;
        console.log(data);
        if (data != null) {
          this.me = data;
          const auth = useAuthStore();
          auth.setMe(data);
        }
        Notify.create({
          color: "info",
          message: "Campo editado",
        });
      } catch (error) {
        Notify.create({
          color: "warning",
          message: "No se ha podido editar el campo",
        });
      }
    },
    setMe(me) {
      this.me = me;
    },
    clearMe() {
      this.me = {};
    },
  },
});
