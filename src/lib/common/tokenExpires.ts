import { serialize } from "cookie";
import jwt from "jsonwebtoken";

interface DecodedToken {
  exp?: number;
  [key: string]: any; // If you have unusedElements claims, you can define them here
}

// Function to check if a token is expired
export const isTokenExpired = (token: string | null) => {
  try {
    if (!token) {
      return true; // Token is considered expired if it's null or undefined
    }
    // Decode the token
    const decodedToken = jwt.decode(token) as DecodedToken | null;

    // Check if the token has an expiration claim and if it has expired
    return !!(
      decodedToken &&
      decodedToken?.exp &&
      decodedToken.exp * 1000 < Date.now()
    );

    // if (decodedToken?.exp && decodedToken.exp * 1000 < Date.now()) {
    //   return true; // Token has expired
    // }
    // return false; // Token is still valid
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return true; // Assume the token is expired if there is an error decoding it
  }
};

// Function to get the expiry date of a token
export const getExpiryDate = (token: string) => {
  try {
    // Decode the token
    const decodedToken = jwt.decode(token) as DecodedToken | null;
    // Check if the token has an expiration claim and if it has expired
    if (decodedToken?.exp) {
      return decodedToken.exp;
    }
    return null;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null; // Assume the token is expired if there is an error decoding it
  }
};

// Function to get the remaining time until token expiry
export const getRemainingTime = (token: string): number => {
  const expiryTime = getExpiryDate(token);
  const currentTimeInMiliSeconds = Date.now();
  if (expiryTime !== null) {
    const refreshTokenRemainingTime =
      expiryTime * 1000 - currentTimeInMiliSeconds;
    return Math.max(refreshTokenRemainingTime, 0);
  }

  return 0; // If token doesn't have expiry or is invalid, return 0
};

// Function to check if the token has a certain time remaining
export const haveTime = (token: string, minutes: number): boolean => {
  const expiryTime = getExpiryDate(token);
  if (expiryTime !== null) {
    const now = Math.floor(Date.now() / 1000);
    const minutesFromNow = now + minutes * 60;

    return expiryTime > minutesFromNow;
  }

  return false; // If token doesn't have expiry or is invalid, return false
};

// Function to create a JWT token cookie
export const makeTokenCookie = (cookieName: string, token: string): string => {
  const maxAge = getRemainingTime(token) / 1000;
  return serialize(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "strict",
    maxAge:  Math.floor(maxAge),
  });
};

// Function to create a data cookie
export const makeDataCooke = (
  cookieName: string,
  data: any,
  time: number,
): string => {
  return serialize(cookieName, data, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "strict",
    maxAge:  Math.floor(time),
  });
};

// Function to destroy a cookie
export const destroyCooke = (cookieName: string) => {
  return serialize(cookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "strict",
    maxAge: -1,
  });
};
