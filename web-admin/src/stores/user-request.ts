import { defineStore } from "pinia";
import { useService } from "../lib/axios";

export const useUserRequestStore = defineStore("userRequest", {
  state: () => ({
    _data: [] as any,
    _isLoading: false,
  }),
  getters: {
    isLoading: (s) => s._isLoading,
    data: (s) => s._data,
  },
  actions: {
    async getUserRequest() {
      this._isLoading = true;
      const res = await useService().get("/request-company?status=PENDING");
      this._data = res?.data;
      this._isLoading = false;
    },
    async approvalRequest(email: string) {
      this._isLoading = true;
      await useService().post("/request-company/approval/" + email);
      this.getUserRequest();
    },
  },
});
