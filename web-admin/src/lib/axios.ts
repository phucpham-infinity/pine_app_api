import axios, { AxiosInstance } from "axios";
import { API_BASE_URL, LOCAL_TOKEN_KEY } from "../config";

export const useService = (): AxiosInstance => {
  const token = localStorage.getItem(LOCAL_TOKEN_KEY);

  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: token,
    },
  });

  instance.interceptors.response.use(
    (response) => {
      return response?.data;
    },
    (error) => {
      console.error(error);
      return Promise.reject(error);
    }
  );
  return instance;
};
