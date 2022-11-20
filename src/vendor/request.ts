import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { message } from "antd";
import { TBaseResponse } from "@/types/response";

export const createAxiosByInterceptors = (
  config?: AxiosRequestConfig
): AxiosInstance => {
  const instance = axios.create({
    ...config,
  });

  instance.interceptors.request.use(
    config => {
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response: AxiosResponse<TBaseResponse<unknown>>) => {
      const { code, msg } = response.data;
      if (code >= 200 && code < 300) {
        return response;
      } else {
        console.log(response.config);
        message.error(msg || "未知错误");
        return Promise.reject(response.data);
      }
    },
    error => {
      message.error(error?.response?.data?.msg || error.message);
      return Promise.reject(error);
    }
  );

  return instance;
};
