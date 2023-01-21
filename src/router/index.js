import { storeToRefs } from "pinia";
import { route } from "quasar/wrappers";
import { useAuthStore } from "src/stores/auth";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either u2 W  * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from) => {
    const auth = useAuthStore();
    if (
      !auth.isAutenticatedNow &&
      (to.path == "/favorite" ||
        to.path.includes("profile") ||
        to.path.includes("admin"))
    ) {
      return { name: "notFound" };
    }
    if (auth.isAutenticatedNow && to.path.includes("auth")) {
      return { name: "notFound" };
    }
  });

  return Router;
});
