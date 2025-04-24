/* eslint-disable import/no-anonymous-default-export */

import {
  getRemainingTime,
  haveTime,
  isTokenExpired,
  makeDataCooke,
  makeTokenCookie,
} from "@/lib/common/tokenExpires";
import { BASE_URL, CookieNames } from "@/lib/constants";
import { API } from "@/lib/constants/api-paths";
import { TokenResponse } from "@/types/authTypes";
import axios, { AxiosResponse } from "axios";
import { parse } from "cookie";

import { HandleAxiosErr } from "@/lib/functions/axios.error";

export default async function (req: any, res: any) {
  if (req.method != "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const cookies = parse(req.headers.cookie || "");
    const refreshToken = cookies[CookieNames.RefreshToken];
    const accessToken = cookies[CookieNames.AccessToken];
    const user = cookies[CookieNames.User];

    if (!refreshToken) {
      res
        .status(403)
        .json({ message: "No Refresh Token!", status: "NOT_FOUND" });
      return;
    }
    if (haveTime(accessToken as string, 2)) {
      console.log("access token have time");
      res.status(200).json({
        message: "Access Token Is Still Valid!",
        access_token: accessToken,
        user_data: JSON.parse(user as string),
      });
      return;
    }
    /**
     * if the refresh token have expired return not authorized, redirect user to login
     */

    if (isTokenExpired(refreshToken)) {
      res
        .status(403)
        .json({ message: "Refresh Token expired!", status: "NOT_AUTHORIZED" });
    }
    const response: AxiosResponse<TokenResponse> = await axios.post(
      `${BASE_URL}/${API.refresh}`,
      { refreshToken: refreshToken },
    );

    const { authToken, userData } = response?.data;
    if (!authToken) {
      return res
        .status(404)
        .json({ message: "No Refresh Token!", status: "NOT_FOUND" });
    }

    const serialisedAccess = makeTokenCookie(
      CookieNames.AccessToken,
      authToken?.accessToken,
    );
    const serialisedRefresh = makeTokenCookie(
      CookieNames.RefreshToken,
      authToken?.refreshToken,
    );
    const serialisedUser = makeDataCooke(
      CookieNames.User,
      JSON.stringify(userData),
      getRemainingTime(authToken?.accessToken),
    );

    res.setHeader("Set-Cookie", [
      serialisedAccess,
      serialisedRefresh,
      serialisedUser,
    ]);

    res.status(200).json({
      message: "Success!",
      user_data: userData,
      access_token: authToken?.accessToken,
    });
  } catch (e: any) {
    console.error("--| API:..refresh:", e.message);
    const msg = HandleAxiosErr(e);
    res.status(msg.Status).json({ message: msg.Message, error: e.message });
  }
}
