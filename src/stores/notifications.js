import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

import { over } from "stompjs";
import SockJS from "sockjs-client/dist/sockjs";
import { api } from "src/boot/axios";
import { useOrdersStore } from "./orders";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

export const useNotifyStore = defineStore("notification", {
  state: () => ({
    sock: null,
    stompClient: null,
    username: "",
    recivername: "",
    connected: false,
    message: "",
    publicChats: [],
    privateChats: new Map(),
    notificationCount: 0,
    router: null,
  }),

  getters: {},

  actions: {
    connect() {
      this.sock = new SockJS(`${api.defaults.baseURL}/our-websocket`);
      this.stompClient = over(this.sock);
      this.stompClient.connect({}, (frame) => {
        this.connected = true;
        this.stompClient.subscribe("/topic/messages", (order) => {
          this.reciveOrderNotification(JSON.parse(order.body));
        });
      });
    },
    reciveOrderNotification(newOrder) {
      const auth = useAuthStore();
      const order = useOrdersStore();
      if (newOrder.recepcionist.user == auth.me.user) {
        order.setOrder(newOrder);
        if (newOrder.state == 0) {
          order.setInvalidOrder(newOrder);
          this.notificationCount++;
          const response = this.checkNotificationPromise();
          if (response) {
            this.notifySystem(newOrder);
          }
        }
      }
    },
    incrementNotificationCount() {
      this.notificationCount++;
    },
    decrementNotificationCount() {
      this.notificationCount--;
    },
    notifySystem(order) {
      const text = `Pedido de ${order.client.user}, valide su dirección`;
      const notification = new Notification(`Pedidos inválidos`, {
        body: text,
      });
      notification.addEventListener("click", () => {
        this.router.push({
          name: "validAddresses",
          params: { id: order.address.id },
        });
      });
      notification.addEventListener("close", () => {
        console.log("Entra aqui");
        const $q = useQuasar();
        $q.dialog({
          title: "Confirmar",
          message: `Esta seguro que no desea validar el pedido.
                          Si no lo hace este se aceptará.`,
          cancel: "Validar pedido",
          ok: "Aceptar",
          persistent: true,
        })
          .onOk(() => {
            return true;
          })
          .onCancel(() => {
            this.router.push({ name: "validAddresses" });
          });
      });
    },
    checkNotificationPromise() {
      try {
        Notification.requestPermission().then();
      } catch (e) {
        return false;
      }
      return true;
    },
  },
});
