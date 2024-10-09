import { makeGetRequest, makePostRequest } from ".";
import { toast } from "../hooks/toast";

export const getWorkerById = async (id: any) => {
  try {
    const { data } = await makeGetRequest(`/worker/detail/${id}`);
    return data;
  } catch (error: any) {
    console.error(
      `[Users] [userService] An error occurred while fetching worker details : `,
      error
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while getting service by id"
    );
    throw error;
  }
};

export const fetchAllWorkers = async ({ pageParam }: any) => {
  try {
    const data = await makeGetRequest(`/worker/all?page=${pageParam}&limit=3`);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching workers : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching services"
    );
    throw error;
  }
};

export const fetchAllLikedWorkers = async ({ pageParam }: any) => {
  try {
    const data = await makeGetRequest(
      `/worker/my-bookmarks?page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching liked workers : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching services"
    );
    throw error;
  }
};

export const likeWorker = async (payload: any) => {
  try {
    const data = await makePostRequest("/worker/add-bookmark", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while liking worker : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching services"
    );
    throw error;
  }
};

export const unlikeWorker = async (payload: any) => {
  try {
    const data = await makePostRequest("/worker/remove-bookmark", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while unliking worker : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching services"
    );
    throw error;
  }
};
