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

export const forgotPassword = async (payload: any) => {
  console.log("Paylaod----", payload);

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
  console.log("Payloadddd---", payload);
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
    router.push("/(tabs)");
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
    const resposne = await makePatchRequest(`/user/info`, payload);
    toast.success("User updated successfully");
    return resposne;
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
      data?.data?.Location
    );
    return data.data;
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
