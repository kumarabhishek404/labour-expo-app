import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { router } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { UserAtom } from "../AtomStore/user";

const getHeaders = async (retries = 3, delay = 500) => {
  try {
    const user: any = await AsyncStorage.getItem("user");
    const parsedUser = user ? JSON.parse(user) : null;
    if (parsedUser?.token) {
      return {
        Authorization: `Bearer ${parsedUser.token}`,
      };
    } else if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay)); // Wait before retrying
      return getHeaders(retries - 1, delay); // Retry after delay
    } else {
      return {
        Authorization: "",
      };
    }
  } catch (error) {
    console.error("Error retrieving token from AsyncStorage:", error);
    return {
      Authorization: "",
    };
  }
};

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
  // headers: async () => {
  //   try {
  //     const user:any = await AsyncStorage.getItem("user");
  //     // const parsedUser = user ? JSON.parse(user) : null;

  //     if (user?.token) {
  //       return { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmRiMTZlZmNkZGFlYmVlMzYzNmI3MTgiLCJpYXQiOjE3MjU4OTI4NzMsImV4cCI6MTcyNTg5NjQ3M30.x5HbEJscmdUS-iAzTa1GR0NS7J7ExcYEw79z-GzTDqU` };
  //     }
  //     return { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmRiMTZlZmNkZGFlYmVlMzYzNmI3MTgiLCJpYXQiOjE3MjU4OTI4NzMsImV4cCI6MTcyNTg5NjQ3M30.x5HbEJscmdUS-iAzTa1GR0NS7J7ExcYEw79z-GzTDqU` };
  //   } catch (error) {
  //     console.error("Error retrieving token from AsyncStorage:", error);
  //     return { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmRiMTZlZmNkZGFlYmVlMzYzNmI3MTgiLCJpYXQiOjE3MjU4OTI4NzMsImV4cCI6MTcyNTg5NjQ3M30.x5HbEJscmdUS-iAzTa1GR0NS7J7ExcYEw79z-GzTDqU` };
  //   }
  // },
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("error.response.statusText--", error.response);
    
    if (error.response) {
      if (
        (error.response.status === 400 &&
          error.response.data.message === "jwt expired") ||
        error.response.data.message === "jwt malformed" ||
        error.response.statusText === "TokenExpiredError" ||
        error.response.statusText === "Unautorized Request"
      ) {
        AsyncStorage.removeItem("user");
        router.push("/screens/auth/login");
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
    }
    throw error;
  }
);

export const makeGetRequest = async (
  url: string,
  headers?: { [key: string]: string },
  responseType:
    | "arraybuffer"
    | "blob"
    | "document"
    | "json"
    | "text"
    | "stream" = "json"
): Promise<any> => {
  const response = await api.get(url, {
    headers: {
      ...(await getHeaders()),
      // ...headers,
    },
    responseType,
  });
  return response;
};

export const makePostRequest = async (
  url: string,
  body: object,
  headers?: { [key: string]: string }
): Promise<AxiosResponse> => {
  const response = await api.post(url, body, {
    headers: {
      // ...api.defaults.headers.common,
      ...(await getHeaders()),
      // ...headers,
    },
  });
  return response;
};

export const makePostRequestFormData = async (
  url: string,
  body: object,
  headers?: { [key: string]: string }
): Promise<AxiosResponse> => {
  const response: any = await api.post(url, body, {
    headers: {
      // ...api.defaults.headers.common,
      ...(await getHeaders()),
      "Content-Type": "multipart/form-data",
      // ...headers,
    },
  });
  return response;
};

export const makePutRequest = async (
  url: string,
  body: object,
  headers?: { [key: string]: string }
): Promise<AxiosResponse> => {
  const response = await api.put(url, body, {
    headers: {
      // ...api.defaults.headers.common,
      ...(await getHeaders())
      // ...headers,
    },
  });
  return response;
};

export const makePutRequestFormData = async (
  url: string,
  body: object,
  headers?: { [key: string]: string }
): Promise<AxiosResponse> => {
  const response: any = await api.put(url, body, {
    headers: {
      // ...api.defaults.headers.common,
      ...(await getHeaders()),
      "Content-Type": "application/json",
      // ...headers,
    },
  });
  return response;
};

export const makePatchRequest = async (
  url: string,
  body: object,
  headers?: { [key: string]: string }
): Promise<AxiosResponse> => {
  const response = await api.patch(url, body, {
    headers: {
      // ...api.defaults.headers.common,
      ...(await getHeaders()),
      // ...headers,
    },
  });
  return response;
};

export const makePatchRequestFormData = async (
  url: string,
  body: object,
  headers?: { [key: string]: string }
): Promise<AxiosResponse> => {
  const response: any = await api.patch(url, body, {
    headers: {
      // ...api.defaults.headers.common,
      ...(await getHeaders()),
      "Content-Type": "multipart/form-data",
      // ...headers,
    },
  });
  return response;
};

export const makeDeleteRequest = async (
  url: string,
  headers?: { [key: string]: string }
): Promise<AxiosResponse> => {
  const response = await api.delete(url, {
    headers: {
      ...(await getHeaders())
    },
  });
  return response;
};
