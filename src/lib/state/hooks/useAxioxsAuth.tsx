"use client";
import { BASE_URL } from "@/lib/constants";
import { useAuth } from "@/lib/state/context/jotai-auth";
import axios from "axios";
import { useEffect } from "react";

export const axiosAuth = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const useAxiosAuth = () => {
  const { accessToken, getAccessToken, logout } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosAuth.interceptors.request.use(
      async (config) => {
        if (!config.headers["Authorization"]) {
          const token = await getAccessToken();
          config.headers["Authorization"] = `Bearer ${token.body}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseIntercept = axiosAuth.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if ((error?.response?.status === 401||error?.response?.status === 403) && !prevRequest?.sent) {
          console.log("axios error11111111 -----");
          prevRequest.sent = true;
          const token = await getAccessToken();
          if (!token.ok) {
            // logout();
            // return;
          }
          prevRequest.headers["Authorization"] = `Bearer ${token.body}`;
          return axiosAuth(prevRequest);
          //TODO make this work
          // await refreshToken();
          //
          // prevRequest.headers[
          //     "Authorization"
          //     ] = `${accessToken}`;
        } else if (error?.response?.status === 401 && prevRequest?.sent) {
          console.log("logging out-------------");
          logout();
        }else if (error?.response?.status === 503 ){
          console.log("======||||||->: no server")
          return Promise.reject(error);
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axiosAuth.interceptors.request.eject(requestIntercept);
      axiosAuth.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, getAccessToken, logout]);

  return axiosAuth;
};

export default useAxiosAuth;
