import { createRouter } from "vue-router";

import LoginPage from "./auth/Login.vue";
import HomePage from "./home/Home.vue";
import { useAuthStore } from "../stores/auth";

export default function (history: any) {
  const router = createRouter({
    history,
    routes: [
      {
        path: "/",
        component: HomePage,
        meta: {
          isPublic: false,
        },
      },
      {
        path: "/login",
        component: LoginPage,
        meta: {
          isPublic: true,
          isAuth: true,
        },
      },
    ],
  });

  router.beforeEach(async (to, from) => {
    if (to.meta.isPublic) {
    }
    const auth = useAuthStore();
    if (auth.$state.token && to.meta.isAuth) {
      return from.fullPath || "/";
    }
    if (!to.meta.isPublic && !auth.$state.token) {
      auth.$state.returnUrl = to.fullPath;
      return "/login";
    }
  });

  return router;
}
