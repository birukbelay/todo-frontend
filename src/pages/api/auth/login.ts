import {
  getRemainingTime,
  makeDataCooke,
  makeTokenCookie,
} from "@/lib/common/tokenExpires";
import { BASE_URL, CookieNames } from "@/lib/constants";
import { API } from "@/lib/constants/api-paths";
import { HandleAxiosErr } from "@/lib/functions/axios.error";
import { TokenResponse } from "@/types/authTypes";
import axios, { AxiosResponse } from "axios";



// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: any, res: any) {
  if (req.method != "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
  }
  try {
    const response: AxiosResponse<TokenResponse> = await axios.post(
      `${BASE_URL}/${API.login}`,
      req.body,
    );
    const { authToken, userData } = response?.data;
    console.log("login response data--", response.data.userData.email);

    const serialisedAccess = makeTokenCookie(
      CookieNames.AccessToken,
      authToken.accessToken,
    );
    const serialisedRefresh = makeTokenCookie(
      CookieNames.RefreshToken,
      authToken.refreshToken,
    );
    const serialisedUser = makeDataCooke(
      CookieNames.User,
      JSON.stringify(userData),
      Math.floor(getRemainingTime(authToken?.accessToken) / 1000),
    );

    res.setHeader("Set-Cookie", [
      serialisedAccess,
      serialisedRefresh,
      serialisedUser,
    ]);

    res.status(201).json({
      message: "Success!",
      user_data: userData,
      access_token: authToken?.accessToken,
    });
  } catch (e: any) {
    console.error("--| API:..login:", e.message);
    const msg = HandleAxiosErr(e);
    res.status(msg.Status).json({ message: msg.Message, error: e.message });
  }
}
