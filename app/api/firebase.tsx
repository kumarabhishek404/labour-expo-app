import auth from "@react-native-firebase/auth";
import { makePostRequest } from ".";

export const signInWithPhoneNumber = async (phoneNumber: string) => {
  console.log("phoneNumber", phoneNumber);
  try {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    return confirmation;
  } catch (error) {
    console.error("Error during phone number authentication:", error);
    throw error;
  }
};

export const verifyCode = async (confirmation: any, code: string) => {
  console.log("confirmation", confirmation);
  console.log("code", code);
  try {
    await confirmation.confirm(code);
    return true;
  } catch (error) {
    console.error("Error verifying OTP code:", error);
    throw error;
  }
};

export const sendEmailCode = async (email: string) => {
  console.log("email", email);
  try {
    const response = await makePostRequest("/auth/send-email-code", { email });
    return response;
  } catch (error) {
    console.error("Error during email verification:", error);
    throw error;
  }
};

export const verifyEmailCode = async (code: string) => {
  console.log("code", code);
  try {
    const response = await makePostRequest("/auth/verify-email-code", { code });
    return response;
  } catch (error) {
    console.error("Error verifying email code:", error);
    throw error;
  }
};
