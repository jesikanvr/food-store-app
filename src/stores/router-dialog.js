import { defineStore } from "pinia";

export const useRouterDialogStore = defineStore("router-dialog", {
  state: () => ({
    count: 0,
  }),

  actions: {
    restoreCount() {
      this.count = 0;
    },
  },
});
