"use client";
import { atom, useAtom } from "jotai";

import { isTokenExpired } from "@/lib/common/tokenExpires";
import { FAIL, Resp, Succeed } from "@/lib/constants/return.const";
import { HandleAxiosErr } from "@/lib/functions/axios.error";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  userName?: string;
  email?: string;
  avatar: string;
  roleId: number;
  role: string;
}

export interface LoginResp {
  access_token: string;
  user_data: User | null;
}

export const userAtom = atom<User | null>(null);
userAtom.debugLabel = "user";
export const accessTokenAtom = atom<string | null>(null);
accessTokenAtom.debugLabel = "accessToken";
export const loadingAtom = atom<boolean | null>(null);
loadingAtom.debugLabel = "loading";
export const loadingAuthAtom = atom<boolean>(false);
loadingAuthAtom.debugLabel = "loadingAuth";
export const loggedInAtom = atom<boolean | null>(null);
loggedInAtom.debugLabel = "loggedIn";
export const networkInAtom = atom<boolean | null>(null);
networkInAtom.debugLabel = "networkStatus";

let refreshPromise: any = null;

export interface LoginCred {
  info: string;
  password: string;
}

export const useAuth = () => {
  const [user, setUser] = useAtom(userAtom);
  const [loggedIn, setLoggedIn] = useAtom(loggedInAtom);
  const [noNetwork, setNoNetwork] = useAtom(networkInAtom);
  const [accessToken, setAccessToken] = useAtom(accessTokenAtom);
  const [loading, setLoading] = useAtom(loadingAtom);
  const [loadingAuth, setLoadingAuth] = useAtom(loadingAuthAtom);
  const router = useRouter();

  useEffect(() => {
    if (loggedIn === null) {
      refreshToken()
        .then((r: any) => {
          console.log("r", r);
        })
        .catch((e) => {
          console.log("|** useEffect-refresh-panic**|", e.message);
          setLoggedIn(false);
        });
    }
  }, [user]);

  const refreshToken = async (): Promise<Resp<string>> => {
    try {
      if (loggedIn === false) return FAIL("User is not logged in"); //to prevent refresh token when user is not logged in
      if (refreshPromise) {
        console.log("Refresh in progress, waiting for result...");
        return refreshPromise;
      }
      // == refresh logic starts here
      setLoading(true);
      refreshPromise = axios.post(`/api/auth/refresh`);

      const response: AxiosResponse<LoginResp> = await refreshPromise;
      const { access_token, user_data } = response?.data;
      setAccessToken(access_token);
      setUser(user_data);
      refreshPromise = null;
      setLoading(false);
      setLoggedIn(true);
      return Succeed(access_token);
    } catch (error) {
      setLoading(false);
      setLoggedIn(false);
      refreshPromise = null;
      const resp = HandleAxiosErr(error);
      console.log("***|refresh.Panic|***", resp.Message);
      // await logout();//if it fails to refresh, it is not necessary to logout
      return FAIL(`"**Failed to refresh token:"${resp.Message}`);
    }
  };
  // const removeCredentials = async () => {
  //   setUser(null);
  //   setAccessToken(null);
  //   setLoggedIn(false);
  // };
  const logout = async () => {
    if (noNetwork) return;
    console.log("logout Called:");
    try {
      setLoadingAuth(true);
      const response = await axios.post(`/api/auth/logout`);
      setUser(null);
      setAccessToken(null);
      setLoggedIn(false);
      console.log("logout success", response.data);
      // router.push("/signin");
      setLoadingAuth(false);
    } catch (err: any) {
      setLoadingAuth(false);
      const resp = HandleAxiosErr(err);
      setLoggedIn(false);
      setNoNetwork(true);
      console.log("***logout.panic***", resp.Message);
      router.push("/signin");
    }
  };
  const getAccessToken = async (): Promise<Resp<string>> => {
    // console.log("get access token called -----");
    if (!accessToken) {
      console.log("no access token----");
      return await refreshToken();
    }
    if (isTokenExpired(accessToken)) {
      console.log("Access token expired, refreshing...");
      return await refreshToken();
    }
    return Succeed(accessToken);
  };
  const login = async (credentials: LoginCred): Promise<Resp<LoginResp>> => {
    try {
      setLoadingAuth(true);
      const response: AxiosResponse<LoginResp> = await axios.post(
        `/api/auth/login`,
        { info_type: "m", ...credentials }
      );
      console.log("login response--", response.data);
      const { access_token, user_data } = response?.data;
      setAccessToken(access_token);
      setUser(user_data);
      setLoading(false);
      setLoggedIn(true);
      setLoadingAuth(false);
      return Succeed(response.data);
    } catch (e: any) {
      setLoadingAuth(false);
      const resp = HandleAxiosErr(e);
      setLoading(false);
      return FAIL(resp.Message);
    }
  };

  return {
    user,
    setUser,
    loggedIn,
    accessToken,
    setAccessToken,
    loading,
    refreshToken,
    logout,
    getAccessToken,
    login,
    loadingAuth
  };
};
