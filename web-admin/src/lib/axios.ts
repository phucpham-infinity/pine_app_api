import axios, { AxiosInstance } from "axios";
import { API_BASE_URL, LOCAL_TOKEN_KEY } from "../config";

export const service = ({
  requiresAuth,
}: {
  requiresAuth: boolean;
}): AxiosInstance => {
  const options = {} as any;

  options.baseURL = API_BASE_URL;
  if (requiresAuth) {
    const token = localStorage.getItem(LOCAL_TOKEN_KEY);
    options.headers.Authorization = token;
  }

  const instance = axios.create(options);

  instance.interceptors.response.use(
    (response) => {
      console.log("good boi!");
      return response;
    },
    (error) => {
      console.error(error);
      return Promise.reject(error);
    }
  );
  return instance;
};
