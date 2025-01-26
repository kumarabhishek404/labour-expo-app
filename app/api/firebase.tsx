import auth from "@react-native-firebase/auth";
import API_CLIENT from ".";

const signInWithPhoneNumber = async (phoneNumber: string) => {
  console.log("phoneNumber", phoneNumber);
  try {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    return confirmation;
  } catch (error) {
    console.error("Error during phone number authentication:", error);
    throw error;
  }
};

const verifyCode = async (confirmation: any, code: string) => {
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

const sendEmailCode = async (email: string) => {
  console.log("email", email);
  try {
    const response = await API_CLIENT.makePostRequest("/auth/send-email-code", { email });
    return response;
  } catch (error) {
    console.error("Error during email verification:", error);
    throw error;
  }
};

const verifyEmailCode = async (code: string) => {
  console.log("code", code);
  try {
    const response = await API_CLIENT.makePostRequest("/auth/verify-email-code", { code });
    return response;
  } catch (error) {
    console.error("Error verifying email code:", error);
    throw error;
  }
};

const FIREBASE = {
  signInWithPhoneNumber,
  verifyCode,
  sendEmailCode,
  verifyEmailCode,
};

export default FIREBASE;
