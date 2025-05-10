import EventEmitter from "eventemitter3"; // ✅ Correct import
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { getToken, removeToken } from "@/utils/authStorage";
import { router } from "expo-router";
import REFRESH_USER from "../hooks/useRefreshUser";

const eventEmitter = new EventEmitter(); // ✅ Create EventEmitter instance

// AsyncStorage?.removeItem("user")
// AsyncStorage?.removeItem("appearedNotifications")
let isLoggedOut = false;

const getHeaders = async (retries = 3, delay = 500) => {
  try {
    // const user = await AsyncStorage.getItem("user");
    const token = await getToken();

    if (!token || token === "null" || token === "undefined") {
      console.warn("No valid user session found.");
      return { Authorization: "" }; // Stop retries
    }

    if (token) {
      return { Authorization: `Bearer ${token}` };
    } else if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return getHeaders(retries - 1, delay);
    } else {
      return { Authorization: "" };
    }
  } catch (error) {
    console.error("Error retrieving token:", error);
    return { Authorization: "" };
  }
};

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
});

const logout = async () => {
  try {
    await AsyncStorage.removeItem("user");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

// ✅ Interceptor: Handle Token Expiry and Emit Logout Event
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const errorMessage = error.response.data.message;
      const statusText = error.response.data.statusText;

      console.log("API Error:", error.response?.data);

      if (
        errorMessage === "jwt expired" ||
        errorMessage === "jwt malformed" ||
        errorMessage === "Invalid Token" ||
        statusText === "TokenExpiredError" ||
        errorMessage === "Unauthorized Request" ||
        statusText === "Unauthorized Request"
      ) {
        console.warn("Token expired. Logging out...");
        logout();
      }

      if (
        error.response?.data &&
        (error.response?.data?.message === "User account is disabled" ||
          error.response?.data?.message === "User is not activated yet" ||
          error.response?.data?.message === "User is suspended")
      ) {
        router.replace("/(tabs)/fifth");
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
    }
    return Promise.reject(error);
  }
);

// ✅ API Request Functions
const makeGetRequest = async (url: string, headers?: object) => {
  return api.get(url, { headers: { ...(await getHeaders()), ...headers } });
};

const makePostRequest = async (
  url: string,
  body?: object,
  headers?: object
): Promise<AxiosResponse> => {
  return api.post(url, body, {
    headers: { ...(await getHeaders()), ...headers },
  });
};

const makePostRequestFormData = async (
  url: string,
  body: object,
  headers?: object
): Promise<AxiosResponse> => {
  return api.post(url, body, {
    headers: {
      ...(await getHeaders()),
      "Content-Type": "multipart/form-data",
      ...headers,
    },
  });
};

const makePutRequest = async (
  url: string,
  body: object,
  headers?: object
): Promise<AxiosResponse> => {
  return api.put(url, body, {
    headers: { ...(await getHeaders()), ...headers },
  });
};

const makePutRequestFormData = async (
  url: string,
  body: object,
  headers?: object
): Promise<AxiosResponse> => {
  return api.put(url, body, {
    headers: {
      ...(await getHeaders()),
      "Content-Type": "multipart/form-data",
      ...headers,
    },
  });
};

const makePatchRequest = async (
  url: string,
  body?: object,
  headers?: object
): Promise<AxiosResponse> => {
  return api.patch(url, body, {
    headers: { ...(await getHeaders()), ...headers },
  });
};

const makePatchRequestFormData = async (
  url: string,
  body: object,
  headers?: object
): Promise<AxiosResponse> => {
  return api.patch(url, body, {
    headers: {
      ...(await getHeaders()),
      "Content-Type": "multipart/form-data",
      ...headers,
    },
  });
};

const makeDeleteRequest = async (
  url: string,
  headers?: object
): Promise<AxiosResponse> => {
  return api.delete(url, { headers: { ...(await getHeaders()), ...headers } });
};

// Export API Client & Event Emitter
const API_CLIENT = {
  makeGetRequest,
  makePostRequest,
  makePostRequestFormData,
  makePutRequest,
  makePutRequestFormData,
  makePatchRequest,
  makePatchRequestFormData,
  makeDeleteRequest,
  eventEmitter,
};

export default API_CLIENT;
