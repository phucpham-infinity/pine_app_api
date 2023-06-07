import { defineStore } from "pinia";
import { LOCAL_TOKEN_KEY } from "../config";
import { useService } from "../lib/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    _user: null as any,
    _token: localStorage.getItem("pina_app_token"),
    _isLoading: false,
    _returnUrl: "",
  }),
  getters: {
    user: (state) => state._user,
    token: (state) => state._token,
    returnUrl: (s) => s._returnUrl,
    isLoading: (s) => s._isLoading,
  },
  actions: {
    getLocalToken() {
      const token = localStorage.getItem(LOCAL_TOKEN_KEY);
      if (token) this._token = token;
    },
    async getMe() {
      this._isLoading = true;
      const res = await useService().get("/user/me");
      this._user = res?.data;
      this._isLoading = false;
    },
    async login(phone: string, password: string) {
      this._isLoading = true;
      const res = await useService().post("/user/login-with-phone", {
        password,
        phone,
      });
      this._isLoading = false;
      this._token = res?.data?.token;
      localStorage.setItem(LOCAL_TOKEN_KEY, res?.data?.token);
      location.reload();
    },
  },
});
