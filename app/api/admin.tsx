import { makeGetRequest } from ".";
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
      error?.response
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching all requests"
    );
    throw error;
  }
};
