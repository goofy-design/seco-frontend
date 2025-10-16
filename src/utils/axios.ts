// axiosInstance.ts
import axios, { AxiosError } from "axios";
import API_CONSTANTS from "./apiConstants";
import { navigateTo } from "./navigateHelper";

const axiosInstance = axios.create({
  baseURL: API_CONSTANTS.BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      navigateTo("/auth");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
