import { createRouter } from "vue-router";

import LoginPage from "./auth/Login.vue";
import AppLayout from "./app/App.vue";
import HomePage from "./app/Home.vue";
import UserRequestPage from "./app/UserRequest.vue";

import { useAuthStore } from "../stores/auth";

export default function (history: any) {
  const router = createRouter({
    history,
    routes: [
      {
        path: "/",
        component: AppLayout,
        children: [
          {
            path: "",
            component: HomePage,
            meta: {
              isPublic: false,
            },
          },
          {
            path: "/user-request",
            component: UserRequestPage,
            meta: {
              isPublic: false,
            },
          },
        ],
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
    if (auth.token && to.meta.isAuth) {
      return from.fullPath || "/";
    }
    if (!to.meta.isPublic && !auth.token) {
      auth.$state._returnUrl = to.fullPath;
      return "/login";
    }
  });

  return router;
}
