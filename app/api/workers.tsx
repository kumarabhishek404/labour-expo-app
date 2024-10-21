import { makeDeleteRequest, makeGetRequest, makePostRequest } from ".";
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
    const data = await makeGetRequest(`/worker/all?page=${pageParam}&limit=5`);
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
  console.log("Payload---", payload);

  try {
    const data = await makeDeleteRequest(`/worker/remove-bookmark/${payload?.workerID}`,);
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

export const fetchAllBookedWorkers = async ({ pageParam }: any) => {
  try {
    const data = await makeGetRequest(
      `/worker/all-booked?page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching booked workers : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching booked workers"
    );
    throw error;
  }
};

export const bookWorker = async (payload: any) => {  
  try {
    const data = await makePostRequest("/worker/book", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while booking worker : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while booking worker"
    );
    throw error;
  }
};

export const removeBookedWorker = async (payload: any) => {
  console.log("Payload---", payload);

  try {
    const data = await makeDeleteRequest(`/worker/remove-booked/${payload?.workerID}`,);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while removing booked worker : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while removing booked worker"
    );
    throw error;
  }
};