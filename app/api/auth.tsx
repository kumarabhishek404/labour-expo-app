import { router } from "expo-router";
import auth from "@react-native-firebase/auth";
import API_CLIENT from ".";
import TOAST from "@/app/hooks/toast";
import axios from "axios";

const checkMobileExistance = async (payload: any) => {
  console.log("Pay---", payload);

  try {
    const response: any = await API_CLIENT.makePostRequest(
      "/user/check-mobile",
      payload
    );
    return response;
  } catch (error: any) {
    console.log(
      `[Check Mobile] [userService] An error occurred while checking mobile number existence: `,
      error?.response?.data?.message
    );

    // Display error message if the API call fails
    TOAST?.error(
      error?.response?.data?.message ||
        "An error occurred while checking mobile number existence."
    );
    throw error;
  }
};

const register = async (payload: any) => {
  console.log("Payload --", payload);

  try {
    const data = await API_CLIENT.makePostRequest("/auth/register", payload);
    TOAST?.success("Your account has registered successfully");
    router.push("/screens/auth/login");
    return data?.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while adding new user : `,
      error?.response?.data?.message
    );
    TOAST?.error(
      error?.response?.data?.message || "An error occurred while adding user"
    );
    throw error;
  }
};

const signIn = async (payload: any) => {
  try {
    console.log(
      `[Sign In] [userService] Signing in the user with API /auth/login and payload `,
      payload
    );
    const data = await API_CLIENT.makePostRequest("/auth/login", payload);
    console.log(
      `[Sign In] [userService] User signed in with the response `,
      data.data
    );
    return data.data;
  } catch (error: any) {
    console.log(
      `[Sign In] [userService] An error occurred while signing the user `,
      error?.response?.data
    );
    TOAST?.error(
      error?.response?.data?.message || "An error occurred while login user"
    );
    throw error;
  }
};

const forgotPassword = async (payload: any) => {
  try {
    const response: any = await API_CLIENT.makePostRequest(
      `/auth/forgot-password-code`,
      payload
    );
    TOAST?.success("Password reset code is sent to your email successfully");
    return response;
  } catch (error: any) {
    console.log(
      `[Forget Password] [userService] An error occured while sending reset password code to your email : `,
      error
    );
    TOAST?.error(
      error?.response?.data?.message ||
        "An error occured while sending reset password code to your email"
    );
    throw error;
  }
};

const resetPassword = async (payload: any) => {
  console.log("Payload --", payload);

  try {
    const data = await API_CLIENT.makePatchRequest(
      `/auth/set-forgot-password`,
      payload
    );
    return data;
  } catch (error: any) {
    console.log(
      `[Forget Password] [userService] An error occured while reseting password : `,
      error
    );
    TOAST?.error(
      error?.response?.data?.message ||
        "An error occurred while reseting password"
    );
    throw error;
  }
};

const sendOTP = async (mobile: string) => {
  try {
    const response = await axios?.get(
      `https://2factor.in/API/V1/${"d0fa8207-0f16-11f0-8b17-0200cd936042"}/SMS/${mobile}/AUTOGEN/OTP1`
    );
    console.log("response", response?.data);

    return response?.data;
  } catch (error) {
    console.error("Error during mobile number authentication:", error);
    TOAST.error(`Error during mobile number authentication: ${error}`);
    throw error;
  }
};

const verifyOTP = async (payload: any) => {
  console.log("payload", payload);
  try {
    const response = await axios?.get(
      `https://2factor.in/API/V1/${"d0fa8207-0f16-11f0-8b17-0200cd936042"}/SMS/VERIFY3/${
        payload?.mobile
      }/${payload?.otp}`
    );
    return response?.data;
  } catch (error) {
    console.error("Error verifying OTP code:", error);
    throw error;
  }
};

const sendEmailCode = async (email: string) => {
  console.log("email", email);
  try {
    const response = await API_CLIENT.makePostRequest("/auth/send-email-code", {
      email,
    });
    return response;
  } catch (error) {
    console.error("Error during email verification:", error);
    throw error;
  }
};

const verifyEmailCode = async (code: string) => {
  console.log("code", code);
  try {
    const response = await API_CLIENT.makePostRequest(
      "/auth/verify-email-code",
      { code }
    );
    return response;
  } catch (error) {
    console.error("Error verifying email code:", error);
    throw error;
  }
};

const validateToken = async () => {
  try {
    const response = await API_CLIENT.makeGetRequest("/auth/validate-token");
    return response;
  } catch (error) {
    console.error("Error validating token:", error);
    throw error;
  }
};

const AUTH = {
  checkMobileExistance,
  register,
  signIn,
  forgotPassword,
  resetPassword,
  sendOTP,
  verifyOTP,
  sendEmailCode,
  verifyEmailCode,
  validateToken,
};

export default AUTH;
