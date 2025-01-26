import API_CLIENT from ".";
import TOAST from "@/app/hooks/toast";

const sendJoiningRequest = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePostRequest("/request/request-joining", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while sending request to the Worker : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while sending request to the Worker"
    );
    throw error;
  }
};

const cancelJoiningRequest = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePostRequest("/request/cancel-request", payload);
    TOAST?.showToast?.success("Request cancelled successfully");
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while cancelling sent request : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while cancelling sent requestr"
    );
    throw error;
  }
};

const acceptJoiningRequest = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePostRequest("/request/accept-request", payload);
    TOAST?.showToast?.success("Request accepted successfully");
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while accepting joining request : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while accepting joining request"
    );
    throw error;
  }
};

const rejectJoiningRequest = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePostRequest("/request/decline-request", payload);
    TOAST?.showToast?.success("Request rejected successfully");
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while rejecting joining request : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while rejecting joining request"
    );
    throw error;
  }
};

const fetchAllRequests = async ({ pageParam }: any) => {
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/requests/all?page=${pageParam}&limit=3`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching requests : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching requests"
    );
    throw error;
  }
};

const fetchRecievedRequests = async ({ pageParam }: any) => {
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/request/all-received-requests?page=${pageParam}&limit=5`
    );
    return data?.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching recieved requests : `,
      error?.response
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching recieved requests"
    );
    throw error;
  }
};

const fetchSentRequests = async ({ pageParam }: any) => {
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/request/all-sent-requests?page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching sent requests : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching sent requests"
    );
    throw error;
  }
};

const leaveFromTeam = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePostRequest("/request/leave-team", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while leaving from team : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while leaving from team"
    );
    throw error;
  }
};

const RATING = {
  sendJoiningRequest,
  cancelJoiningRequest,
  acceptJoiningRequest,
  rejectJoiningRequest,
  fetchAllRequests,
  fetchRecievedRequests,
  fetchSentRequests,
  leaveFromTeam,
};

export default RATING;
