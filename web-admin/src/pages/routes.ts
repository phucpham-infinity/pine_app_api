import { createRouter } from "vue-router";

import LoginPage from "./auth/Login.vue";
import HomePage from "./home/Home.vue";

export default function (history: any) {
  return createRouter({
    history,
    routes: [
      {
        path: "/",
        component: HomePage,
      },
      {
        path: "/login",
        component: LoginPage,
      },
    ],
  });
}
