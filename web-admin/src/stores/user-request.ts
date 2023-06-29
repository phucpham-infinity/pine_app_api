import { defineStore } from "pinia";
import { useService } from "../lib/axios";
import { Notify } from "quasar";

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
      const res = await useService()
        .get("/request-company?status=PENDING")
        .finally(() => {
          this._isLoading = false;
        });
      if (res?.data) this._data = res?.data;
    },
    async approvalRequest({
      email,
      userId,
      companyName,
    }: {
      email: string;
      userId: string;
      companyName: string;
    }) {
      this._isLoading = true;
      try {
        await useService().put(
          `/request-company/approval?email=${email}&userId=${userId}&companyName=${companyName}`
        );
//        await useService().post(`/profile/${userId}`, {
//          firstName: "John",
//          lastName: "Smith",
//          nationality: "United Kingdom",
//          IDNumber: generateIDNumber(),
//          type: "COMPANY",
//        });
        Notify.create({
          message: "Approval user done!",
          type: "positive",
          position: "top-right",
        });
        this.getUserRequest();
      } catch (error: any) {
        Notify.create({
          message: error?.response?.data?.error || "Something error!",
          type: "negative",
          position: "top-right",
        });
        this._isLoading = false;
      }

      this._isLoading = false;
    },
  },
});
