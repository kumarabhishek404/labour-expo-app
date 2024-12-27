import auth from "@react-native-firebase/auth";

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


export const verifyEmail = async (email: string) => {
    console.log("email", email);
    try {
    //   const confirmation = await auth().signInWithEmailAndPassword(email);
    //   return confirmation;
    } catch (error) {
      console.error("Error during phone number authentication:", error);
      throw error;
    }
  };
  
  export const verifyEmailCode = async (confirmation: any, code: string) => {
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