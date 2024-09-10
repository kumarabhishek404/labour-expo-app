// import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";
// import { useAtomValue } from "jotai";
// interface User {
//   token?: string;
//   // Add other user properties if needed
// }

// const api: AxiosInstance = axios.create({
//   baseURL: "https://labour-app-backend.onrender.com/api/v1",
//   headers: {
//     Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmRiMTZlZmNkZGFlYmVlMzYzNmI3MTgiLCJpYXQiOjE3MjU4NzA2NzQsImV4cCI6MTcyNTg3NDI3NH0.OI2EuZA7YIJqseHzY3QEE4neVQQJgBntaJSfCzfdAeU`,
//   },
// });

// api.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   (error: any) => {
//     if (error.response) {
//       if (
//         (error.response.data.statusCode === 401 &&
//           error.response.data.message === "TokenExpiredError") ||
//         error.response.data.errorCode === "TokenExpiredError"
//       ) {
//         const myValue = localStorage.getItem("user") ?? "";
//         let parseValue: any = JSON.parse(myValue);
//         parseValue.token = null;
//         localStorage.setItem("user", JSON.stringify(parseValue));
//         window.location.href = "/auth/login";
//       }
//     } else if (error.request) {
//       console.error("No response received:", error.request);
//     } else {
//       console.error("Request error:", error.message);
//     }
//     throw error;
//   }
// );

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";

const getHeaders = async () => {
  try {
    const user: any = await AsyncStorage.getItem("user");
    const parsedUser = user ? JSON.parse(user) : null;
    console.log("TOKEN---", parsedUser?.token);

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
  baseURL: "https://labour-app-backend.onrender.com/api/v1",
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
    if (error.response) {
      if (
        (error.response.data.statusCode === 401 &&
          error.response.data.message === "TokenExpiredError") ||
        error.response.data.errorCode === "TokenExpiredError"
      ) {
        AsyncStorage.removeItem("user");
        window.location.href = "/auth/login"; // Replace with appropriate navigation logic for React Native
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
