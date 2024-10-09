import { makeGetRequest, makePostRequest } from ".";
import { toast } from "../hooks/toast";

export const fetchAllMembers = async ({ pageParam }: any) => {
  try {
    const data = await makeGetRequest(
      `/mediator/members?page=${pageParam}&limit=3`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching all members : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching all members"
    );
    throw error;
  }
};

export const fetchAllMediators = async ({ pageParam }: any) => {
  try {
    const data = await makeGetRequest(
      `/mediator/all?page=${pageParam}&limit=3`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching all mediators : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching all mediators"
    );
    throw error;
  }
};
