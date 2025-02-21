import API_CLIENT from ".";
import TOAST from "@/app/hooks/toast";

const sendTeamRequest = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePostRequest(
      "/mediator/team/request/send",
      payload
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while sending request to the Worker : `,
      error?.response?.data?.message
    );
    TOAST?.error(
      error?.response?.data?.message ||
        "An error occurred while sending request to the Worker"
    );
    throw error;
  }
};

const fetchSentTeamRequests = async ({ pageParam }: any) => {
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/mediator/team/request/sent/all?page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching sent requests : `,
      error?.response?.data?.message
    );
    TOAST?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching sent requests"
    );
    throw error;
  }
};

const cancelTeamRequest = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePostRequest(
      "/mediator/team/request/cancel",
      payload
    );
    TOAST?.success("Request cancelled successfully");
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while cancelling sent request : `,
      error?.response?.data?.message
    );
    TOAST?.error(
      error?.response?.data?.message ||
        "An error occurred while cancelling sent requestr"
    );
    throw error;
  }
};

const fetchAllMembers = async ({
  mediatorId,
  pageParam,
  category = "",
}: any) => {
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/mediator/team/${mediatorId}/members?category=${category}&page=${pageParam}&limit=3`
    );
    console.log("[userService] member fetched successfully ");

    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching all members : `,
      error?.response?.data?.message
    );
    TOAST?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching all members"
    );
    throw error;
  }
};

const removeMemberFromTeam = async (payload: any) => {
  try {
    const data = await API_CLIENT.makeDeleteRequest(
      `/mediator/team/member/${payload?.memberID}/remove`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[mediatorService] An error occurred while removing member : `,
      error?.response?.data?.message
    );
    TOAST?.error(
      error?.response?.data?.message ||
        "An error occurred while removing member from team"
    );
    throw error;
  }
};

const MEDIATOR = {
  sendTeamRequest,
  fetchSentTeamRequests,
  cancelTeamRequest,
  fetchAllMembers,
  removeMemberFromTeam,
};

export default MEDIATOR;
