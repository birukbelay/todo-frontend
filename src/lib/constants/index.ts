export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export enum CookieNames {
  AccessToken = "access_token",
  RefreshToken = "refresh_token",
  User = "user",
}

export const Headers = {
    MULTI: {
      "Content-Type": "multipart/form-data",
    },
    JSON: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  export enum MTD {
    POST = "POST",
    PATCH = "PATCH",
    DELETE = "DELETE",
  }
  