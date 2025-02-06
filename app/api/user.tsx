import { router } from "expo-router";
import API_CLIENT from ".";
import TOAST from "@/app/hooks/toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { t } from "@/utils/translationHelper";

const register = async (payload: any) => {
  console.log("Payload --", payload);

  try {
    const data = await API_CLIENT.makePostRequest("/auth/register", payload);
    TOAST?.showToast?.success("Your account has registered successfully");
    router.push("/screens/auth/login");
    return data?.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while adding new user : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message || "An error occurred while adding user"
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
    TOAST?.showToast?.success(
      "Password reset code is sent to your email successfully"
    );
    return response;
  } catch (error: any) {
    console.log(
      `[Forget Password] [userService] An error occured while sending reset password code to your email : `,
      error
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occured while sending reset password code to your email"
    );
    throw error;
  }
};

const resetPassword = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePatchRequest(
      `/auth/set-forgot-password`,
      payload
    );
    TOAST?.showToast?.success("Password Reset successfully");
    return data;
  } catch (error: any) {
    console.log(
      `[Forget Password] [userService] An error occured while reseting password : `,
      error
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while reseting password"
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
    TOAST?.showToast?.error(
      error?.response?.data?.message || "An error occurred while login user"
    );
    throw error;
  }
};

const updateUserById = async (payload: any) => {
  try {
    const response = await API_CLIENT.makePatchRequestFormData(
      `/user/info`,
      payload
    );
    TOAST?.showToast?.success(t("profileUpdatedSuccessfully"));
    return response;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while updating user : `,
      error?.response?.data
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message || "An error occurred while updating user"
    );
    throw error;
  }
};

const updateUserRoleById = async (payload: any) => {
  try {
    const resposne = await API_CLIENT.makePatchRequest(
      `/auth/set-role`,
      payload
    );
    TOAST?.showToast?.success("Role updated successfully");
    return resposne;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while updating of user : `,
      error?.response?.data
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while updating of user"
    );
    throw error;
  }
};

const deleteUserById = () => {
  try {
    const data = API_CLIENT.makeDeleteRequest(`/user/delete`);
    TOAST?.showToast?.success("User deleted successfully");
    AsyncStorage.removeItem("user");
    router.push("/screens/auth/login");
    return data;
  } catch (error: any) {
    console.error(
      `[Users] [userService] An error occurred while deleting user : `,
      error
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message || "An error occurred while deleting user"
    );
    throw error;
  }
};

const uploadFile = async (file: any) => {
  console.log(
    "[userService] Uploading file with API /user/upload-pic and file payload  : ",
    file
  );
  try {
    const data = await API_CLIENT.makePostRequestFormData(
      "/user/upload-pic",
      file
    );
    TOAST?.showToast?.success(t("fileUploadedSuccessfully"));
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
    TOAST?.showToast?.error(
      error?.response?.data?.message || "An error occurred while uploading file"
    );
    throw error;
  }
};

const registerDevice = async (payload: any) => {
  console.log("Payload --", payload);

  try {
    console.log(
      `[Sign In] [userService] registering the user device with API /notification/register and payload `,
      payload
    );
    await API_CLIENT.makePostRequest("/notification/register", payload);
    console.log(
      `[Sign In] [userService] user device registered successfully with the response `
    );
    // return data.data;
  } catch (error: any) {
    console.log(
      `[Sign In] [userService] An error occurred while registering user device `,
      error?.response?.data
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while registering user device"
    );
    throw error;
  }
};

const getUserById = async (id: any) => {
  try {
    const { data } = await API_CLIENT.makeGetRequest(`/user/detail/${id}`);
    return data;
  } catch (error: any) {
    console.error(
      `[Users] [userService] An error occurred while fetching user details : `,
      error
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while getting user details"
    );
    throw error;
  }
};

const getUserInfo = async () => {
  try {
    const { data } = await API_CLIENT.makeGetRequest(`/user/info`);
    return data;
  } catch (error: any) {
    console.error(
      `[Users] [userService] An error occurred while refreshing user details  : `,
      error
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while getting user details"
    );
    throw error;
  }
};

const fetchAllUsers = async ({ pageParam }: any) => {
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/user/all?page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching users : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message || "An error occurred while fetching users"
    );
    throw error;
  }
};

const fetchAllLikedUsers = async ({ pageParam }: any) => {
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/user/all-liked?page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching liked users : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching liked users"
    );
    throw error;
  }
};

const addAppFeedback = async (payload: any) => {
  console.log("Payload --", payload);
  try {
    const data = await API_CLIENT.makePostRequest("/feedback/submit", payload);
    TOAST?.showToast?.success(t("feedbackSubmittedSuccessfully"));
    return data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while adding app feedback : `,
      error?.response?.data?.data?.errors
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while adding app feedback"
    );
    throw error;
  }
};

const leaveTeam = async () => {
  try {
    const data = await API_CLIENT.makePostRequest(`/request/leave-org`);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while leaving team : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message || "An error occurred while leaving team"
    );
    throw error;
  }
};

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
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while checking mobile number existence."
    );
    throw error;
  }
};

const disableAccount = async () => {
  try {
    const data = await API_CLIENT.makeDeleteRequest(`/user/disable-account`);
    return data;
  } catch (error: any) {
    console.log(
      `[Forget Password] [userService] An error occured while disabling account : `,
      error
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while disabling account"
    );
    throw error;
  }
};

const enableAccount = async () => {
  try {
    const data = await API_CLIENT.makePatchRequest(`/user/enable-account`);
    return data;
  } catch (error: any) {
    console.log(
      `[Forget Password] [userService] An error occured while enabling account : `,
      error
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while enabling account"
    );
    throw error;
  }
};

const USER = {
  register,
  forgotPassword,
  resetPassword,
  signIn,
  updateUserById,
  updateUserRoleById,
  deleteUserById,
  uploadFile,
  registerDevice,
  getUserById,
  getUserInfo,
  fetchAllUsers,
  fetchAllLikedUsers,
  addAppFeedback,
  leaveTeam,
  checkMobileExistance,
  disableAccount,
  enableAccount,
};

export default USER;
