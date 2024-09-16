import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { router } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { UserAtom } from "../AtomStore/user";

const getHeaders = async () => {
  try {
    const user: any = await AsyncStorage.getItem("user");
    const parsedUser = user ? JSON.parse(user) : null;
    if (parsedUser?.token) {
      return {
        Authorization: `Bearer ${parsedUser?.token}`,
      };
    }
    return {};
  } catch (error) {
    console.error("Error retrieving token from AsyncStorage:", error);
    return {};
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
    // console.log("Error in interceptors - ", error.response.data);
    // const setUserDetails = useSetAtom(UserAtom);
    if (error.response) {
      // console.log("Error in interceptors resposne - ", error.response);
      if (
        (error.response.status === 400 &&
          error.response.data.message === "jwt expired") ||
        error.response.statusText === "TokenExpiredError"
      ) {
        AsyncStorage.removeItem("user");
        // setUserDetails({});
        // window.location.href = "/auth/login";
        router.push("/auth/login");
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
  console.log(
    "Data inside get - ",
    url,
    headers,
    responseType,
    await getHeaders()
  );

  const response = await api.get(url, {
    headers: {
      ...(await getHeaders()),
      ...headers,
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
  console.log("Inside make post request - ", url, body, headers);
  const response = await api.post(url, body, {
    headers: {
      // ...api.defaults.headers.common,
      ...(await getHeaders()),
      "Content-Type": "application/json",
      ...headers,
    },
  });
  console.log("Ressssssssss----", response);
  
  return response;
};

export const makePostRequestFormData = async (
  url: string,
  body: object,
  headers?: { [key: string]: string }
): Promise<AxiosResponse> => {
  console.log("Inside make post request - ", url, body, headers);
  const response: any = await api.post(url, body, {
    headers: {
      // ...api.defaults.headers.common,
      ...(await getHeaders()),
      "Content-Type": "multipart/form-data",
      "Accept": "*/*",
      ...headers,
    },
  });
  console.log("Ressssspooosss---", response);
  return response.json();
};

export const makePutRequest = async (
  url: string,
  body: object,
  headers?: { [key: string]: string }
): Promise<AxiosResponse> => {
  const response = await api.put(url, body, {
    headers: {
      // ...api.defaults.headers.common,
      ...(await getHeaders()),
      ...headers,
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
      // ...api.defaults.headers.common,
      ...(await getHeaders()),
      ...headers,
    },
  });
  return response;
};
