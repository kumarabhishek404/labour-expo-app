import API_CLIENT from ".";
import TOAST from "@/app/hooks/toast";

const fetchAllUsers = async ({ pageParam, status }: any) => {
  console.log("status", status);
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/admin/all-users?status=${status}&page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[adminService] An error occurred while fetching users : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message || "An error occurred while fetching users"
    );
    throw error;
  }
};

const fetchAllRequestsForAdmin = async ({ pageParam, type }: any) => {
  console.log("type", type);
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/admin/all-requests?status=${type}&page=${pageParam}&limit=5`
    );
    return data?.data;
  } catch (error: any) {
    console.error(
      `[adminService] An error occurred while fetching all requests : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching all requests"
    );
    throw error;
  }
};

const suspendUser = async (payload: any) => {
  console.log("payload in the api suspend user", payload);
  try {
    const data = await API_CLIENT.makeDeleteRequest(
      `/admin/suspend-user/${payload?.userId}`
    );
    return data?.data;
  } catch (error: any) {
    console.error(
      `[adminService] An error occurred while suspending user : `,
      error?.response?.data
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while suspending user"
    );
    throw error;
  }
};

const activateUser = async (payload: any) => {
  console.log("payload in the api activate user", payload);
  try {
    const data = await API_CLIENT.makePostRequest(
      `/admin/activate-user`,
      payload
    );
    return data?.data;
  } catch (error: any) {
    console.error(
      `[adminService] An error occurred while activating user : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while activating user"
    );
    throw error;
  }
};

const fetchAllFeedbacks = async () => {
  try {
    const data = await API_CLIENT.makeGetRequest("/feedback/all");
    return data?.data;
  } catch (error: any) {
    console.error(
      `[adminService] An error occurred while fetching feedbacks : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message || "An error occurred while fetching users"
    );
    throw error;
  }
};

const ADMIN = {
  fetchAllUsers,
  fetchAllRequestsForAdmin,
  suspendUser,
  activateUser,
  fetchAllFeedbacks,
};

export default ADMIN;
