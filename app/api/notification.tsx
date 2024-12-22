import { makeDeleteRequest, makeGetRequest, makePostRequest } from ".";
import { toast } from "../hooks/toast";

export const fetchAllNotifications = async ({ pageParam }: any) => {
  console.log("Page param ---", pageParam);

  try {
    const data = await makeGetRequest(
      `/notification/all?page=${pageParam}&limit=10`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching all notifications : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching all notifications"
    );
    throw error;
  }
};
