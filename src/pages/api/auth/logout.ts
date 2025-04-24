import { destroyCooke } from "@/lib/common/tokenExpires";
import { BASE_URL, CookieNames } from "@/lib/constants";
import { API } from "@/lib/constants/api-paths";
import axios from "axios";
import { parse } from "cookie";

import { HandleAxiosErr } from "@/lib/functions/axios.error";



// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: any, res: any) {
  if (req.method != "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }
  const serialisedAccess = destroyCooke(CookieNames.AccessToken);
  const serialisedRefresh = destroyCooke(CookieNames.RefreshToken);
  const serialisedUser = destroyCooke(CookieNames.User);

  try {
    // Clear cookies by setting them to expire immediately
    const cookies = parse(req.headers.cookie || "");
    const refreshToken = cookies[CookieNames.RefreshToken];

    const response = await axios.post(`${BASE_URL}/${API.logout}`, {
      token: refreshToken,
    });

    console.log("logout response data==", response?.data);

    res.setHeader("Set-Cookie", [
      serialisedAccess,
      serialisedRefresh,
      serialisedUser,
    ]);

    res.status(200).json({
      message: "Success!",
    });
  } catch (e: any) {
    console.error("--| API:..logout:", e.message);
    const msg = HandleAxiosErr(e);
    res.status(msg.Status).json({ message: msg.Message, error: e.message });
  }
}
