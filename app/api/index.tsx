import EventEmitter from "eventemitter3";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { getToken } from "@/utils/authStorage";
import { getClientDeviceHeaders } from "@/utils/clientDeviceInfo";
import { router } from "expo-router";

const eventEmitter = new EventEmitter();

const getHeaders = async (retries = 3, delay = 500) => {
  try {
    // const user = await AsyncStorage.getItem("user");
    const token = await getToken();

    if (!token || token === "null" || token === "undefined") {
      return { Authorization: "" };
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

api.interceptors.request.use((config) => {
  const deviceHeaders = getClientDeviceHeaders();
  Object.assign(config.headers, deviceHeaders);
  return config;
});

const logout = async () => {
  try {
    console.log("🔒 Logout triggered from API client");
    await AsyncStorage.removeItem("user");
    // eventEmitter.emit("logout");
    router.replace('/screens/auth/login')
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

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
