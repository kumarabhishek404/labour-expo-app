import { makeDeleteRequest, makeGetRequest, makePostRequest } from ".";
import { toast } from "../hooks/toast";

export const fetchAllUsers = async ({ pageParam, status, role }: any) => {
  console.log("status", status, "role", role);
  try {
    const data = await makeGetRequest(
      `/admin/all-users?role=${role}&status=${status}&page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[adminService] An error occurred while fetching users : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message || "An error occurred while fetching users"
    );
    throw error;
  }
};

export const fetchAllRequestsForAdmin = async ({ pageParam, type }: any) => {
  console.log("type", type);
  try {
    const data = await makeGetRequest(
      `/admin/all-requests?status=${type}&page=${pageParam}&limit=5`
    );
    return data?.data;
  } catch (error: any) {
    console.error(
      `[adminService] An error occurred while fetching all requests : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching all requests"
    );
    throw error;
  }
};

export const suspendUser = async (payload: any) => {
  console.log("payload in the api suspend user", payload);
  try {
    const data = await makeDeleteRequest(
      `/admin/suspend-user/${payload?.userId}`
    );
    return data?.data;
  } catch (error: any) {
    console.error(
      `[adminService] An error occurred while suspending user : `,
      error?.response?.data
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while suspending user"
    );
    throw error;
  }
};

export const activateUser = async (payload: any) => {
  console.log("payload in the api activate user", payload);
  try {
    const data = await makePostRequest(`/admin/activate-user`, payload);
    return data?.data;
  } catch (error: any) {
    console.error(
      `[adminService] An error occurred while activating user : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while activating user"
    );
    throw error;
  }
};
