import { router } from "expo-router";
import {
  makeDeleteRequest,
  makeGetRequest,
  makePatchRequest,
  makePatchRequestFormData,
  makePostRequest,
  makePostRequestFormData,
  makePutRequest,
} from ".";
import { toast } from "../hooks/toast";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const register = async (payload: any) => {
  try {
    const data = await makePostRequestFormData("/auth/register", payload);
    toast.success("Your account has registered successfully");
    router.push("/screens/auth/login");
    return data?.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while adding new user : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message || "An error occurred while adding user"
    );
    throw error;
  }
};

export const forgotPassword = async (payload: any) => {
  try {
    const response: any = await makePostRequest(
      `/auth/forgot-password-code`,
      payload
    );
    toast.success("Password reset code is sent to your email successfully");
    return response;
  } catch (error: any) {
    console.log(
      `[Forget Password] [userService] An error occured while sending reset password code to your email : `,
      error
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occured while sending reset password code to your email"
    );
    throw error;
  }
};

export const resetPassword = async (payload: any) => {
  try {
    const data = await makePatchRequest(`/auth/set-forgot-password`, payload);
    toast.success("Password Reset successfully");
    return data;
  } catch (error: any) {
    console.log(
      `[Forget Password] [userService] An error occured while reseting password : `,
      error
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while reseting password"
    );
    throw error;
  }
};

export const signIn = async (payload: any) => {
  try {
    console.log(
      `[Sign In] [userService] Signing in the user with API /auth/login and payload `,
      payload
    );
    const data = await makePostRequest("/auth/login", payload);
    console.log(
      `[Sign In] [userService] User signed in with the response `,
      data.data
    );
    return data.data;
  } catch (error: any) {
    console.log(
      `[Sign In] [userService] An error occurred while signing the user `,
      error
    );
    toast.error(
      error?.response?.data?.message || "An error occurred while login user"
    );
    throw error;
  }
};

export const updateUserById = async (payload: any) => {
  try {
    const response = await makePatchRequest(`/user/info`, payload);
    toast.success("User updated successfully");
    return response;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while updating user : `,
      error?.response?.data
    );
    toast.error(
      error?.response?.data?.message || "An error occurred while updating user"
    );
    throw error;
  }
};

export const updateUserRoleById = async (payload: any) => {
  try {
    const resposne = await makePatchRequest(`/auth/set-role`, payload);
    toast.success("Role updated successfully");
    return resposne;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while updating role of user : `,
      error?.response?.data
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while updating role of user"
    );
    throw error;
  }
};

export const deleteUserById = () => {
  try {
    const data = makeDeleteRequest(`/user/delete`);
    toast.success("User deleted successfully");
    AsyncStorage.removeItem("user");
    router.push("/screens/auth/login");
    return data;
  } catch (error: any) {
    console.error(
      `[Users] [userService] An error occurred while deleting user : `,
      error
    );
    toast.error(
      error?.response?.data?.message || "An error occurred while deleting user"
    );
    throw error;
  }
};

export const uploadFile = async (file: any) => {
  console.log(
    "[userService] Uploading file with API /upload/file and file payload  : ",
    file
  );
  try {
    const data = await makePatchRequestFormData("/user/upload", file);
    toast.success("File uploaded successfully");
    console.log(
      "[userService] File uploaded successfully with file location",
      data?.data
    );
    return data?.data;
  } catch (error: any) {
    console.error(
      "[userService] An error occurred while uploading file",
      error?.response?.data
    );
    toast.error(
      error?.response?.data?.message || "An error occurred while uploading file"
    );
    throw error;
  }
};

export const registerDevice = async (payload: any) => {
  console.log("Payload --", payload);

  try {
    console.log(
      `[Sign In] [userService] registering the user device with API /notification/register and payload `,
      payload
    );
    await makePostRequest("/notification/register", payload);
    console.log(
      `[Sign In] [userService] user device registered successfully with the response `
    );
    // return data.data;
  } catch (error: any) {
    console.log(
      `[Sign In] [userService] An error occurred while registering user device `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while registering user device"
    );
    throw error;
  }
};


export const getUserById = async (id: any) => {
  try {
    const { data } = await makeGetRequest(`/user/detail/${id}`);
    return data;
  } catch (error: any) {
    console.error(
      `[Users] [userService] An error occurred while fetching user details : `,
      error
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while getting user details"
    );
    throw error;
  }
};

export const fetchAllUsers = async ({ pageParam, role }: any) => {
  try {
    const data = await makeGetRequest(
      `/user/all?page=${pageParam}&limit=5&role=${role}`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching users : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching users"
    );
    throw error;
  }
};

export const fetchAllLikedUsers = async ({ pageParam, role }: any) => {
  try {
    const data = await makeGetRequest(
      `/user/all-liked/${role}?page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching liked users : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching liked users"
    );
    throw error;
  }
};