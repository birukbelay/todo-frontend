/* eslint-disable @typescript-eslint/no-explicit-any */
interface Msg {
  Status: number;
  Message: string;
}

export function HandleAxiosErr(e: any): Msg {
  console.log(" `````````` `````````` error |||", e.message);

  if (e.response) {
    console.log(
      "--SERVER RESPONDED WITH ERROR",
      e.response.status,
      // e.response?.data?.message,
    );
    let msg: string;
    if (typeof e.response.data.message === "string") {
      msg = e.response.data.message;
    } else if (typeof e.response.data === "string") {
      msg = e.response.data;
    } else if (
      Array.isArray(e.response.data.message) &&
      e.response.data.message.length > 0
    ) {
      msg = e.response.data.message[0];
    } else if (e.response.data.message === undefined) {
      console.error("--||| Undefined msg:", e.response.data);
      msg = JSON.stringify(e.response.data);
    } else {
      msg = JSON.stringify(e.response.data.message);
    }
    return { Status: e.response?.status, Message: msg };
  } else if (e.request) {
    console.log("--|| Request Error:", e.message);
    return { Status: 503, Message: "could not reach the server" };
  } else {
    return { Status: 400, Message: "Request Format Error" };
  }
}
