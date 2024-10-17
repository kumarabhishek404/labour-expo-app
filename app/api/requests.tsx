import { makeGetRequest, makePostRequest } from ".";
import { toast } from "../hooks/toast";

export const sendJoiningRequest = async (payload: any) => {
  try {
    const data = await makePostRequest("/request/request-joining", payload);
    toast.success("Request sent successfully");
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while sending request to the Worker : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while sending request to the Worker"
    );
    throw error;
  }
};

export const cancelJoiningRequest = async (payload: any) => {
  try {
    const data = await makePostRequest("/request/cancel-request", payload);
    toast.success("Request cancelled successfully");
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while cancelling sent request : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while cancelling sent requestr"
    );
    throw error;
  }
};

export const acceptJoiningRequest = async (payload: any) => {
  try {
    const data = await makePostRequest("/request/accept-request", payload);
    toast.success("Request accepted successfully");
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while accepting joining request : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while accepting joining request"
    );
    throw error;
  }
};

export const rejectJoiningRequest = async (payload: any) => {
  try {
    const data = await makePostRequest("/request/decline-request", payload);
    toast.success("Request rejected successfully");
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while rejecting joining request : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while rejecting joining request"
    );
    throw error;
  }
};

export const fetchAllRequests = async ({ pageParam }: any) => {
  try {
    const data = await makeGetRequest(
      `/requests/all?page=${pageParam}&limit=3`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching requests : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching requests"
    );
    throw error;
  }
};

export const fetchRecievedRequests = async ({ pageParam }: any) => {
  try {
    const data = await makeGetRequest(
      `/request/all-received-requests?page=${pageParam}&limit=5`
    );
    return data?.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching recieved requests : `,
      error?.response
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching recieved requests"
    );
    throw error;
  }
};

export const fetchSentRequests = async ({ pageParam }: any) => {
  try {
    const data = await makeGetRequest(
      `/request/all-sent-requests?page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching sent requests : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching recieved requests"
    );
    throw error;
  }
};
