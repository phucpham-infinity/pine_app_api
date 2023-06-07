import { defineStore } from "pinia";
import { useService } from "../lib/axios";

export const useUserRequestStore = defineStore("userRequest", {
  state: () => ({
    _data: null as any,
    _isLoading: false,
  }),
  getters: {
    isLoading: (s) => s._isLoading,
    data: (s) => s._data,
  },
  actions: {
    async getUserRequest() {
      this._isLoading = true;
      const res = await useService().get("/user/me");
      this._data = res?.data;
      this._isLoading = false;
    },
  },
});
