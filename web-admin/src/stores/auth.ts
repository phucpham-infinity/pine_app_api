import { defineStore } from "pinia";
import { LOCAL_TOKEN_KEY } from "../config";
import { service } from "../lib/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as any,
    token: localStorage.getItem("pina_app_token"),
    isLoading: false,
    returnUrl: "",
  }),
  getters: {
    user: (state) => state.user,
    token: (state) => state.token,
    returnUrl: (s) => s.returnUrl,
  },
  actions: {
    getLocalToken() {
      const token = localStorage.getItem(LOCAL_TOKEN_KEY);
      if (token) this.token = token;
    },
    async login(phone: string, password: string) {
      this.isLoading = true;
      const data = await service({ requiresAuth: false }).post(
        "/user/login-with-phone",
        {
          password,
          phone,
        }
      );
      this.isLoading = false;
      this.user = data;
    },
  },
});
