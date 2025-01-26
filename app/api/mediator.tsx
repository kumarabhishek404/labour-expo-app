import API_CLIENT from ".";
import TOAST from "@/app/hooks/toast";

const getMediatorById = async (id: any) => {
  try {
    const { data } = await API_CLIENT.makeGetRequest(`/user/detail/${id}`);
    return data;
  } catch (error: any) {
    console.error(
      `An error occurred while fetching mediator details : `,
      error
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while getting mediator by id"
    );
    throw error;
  }
};

const fetchAllMediators = async ({ pageParam, skill }: any) => {
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/user/all?page=${pageParam}&limit=5&skill=${skill}&role=MEDIATOR`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching all mediators : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching all mediators"
    );
    throw error;
  }
};

const fetchAllBookedMediators = async ({ pageParam, skill }: any) => {
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/mediator/all-booked?page=${pageParam}&limit=5&skill=${skill}`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching booked mediators : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching booked mediators"
    );
    throw error;
  }
};

const bookMediator = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePostRequest("/mediator/book", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while booking mediator : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while booking mediators"
    );
    throw error;
  }
};

const removeBookedMediator = async (payload: any) => {
  try {
    const data = await API_CLIENT.makeDeleteRequest(
      `/mediator/remove-booked/${payload?.mediatorID}`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while removing booked mediators : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while removing booked mediators"
    );
    throw error;
  }
};

const likeMediator = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePostRequest(`/user/like/${payload?.mediatorID}`);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while liking mediator : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching services"
    );
    throw error;
  }
};

const unlikeMediator = async ({ mediatorID }: any) => {
  try {
    const data = await API_CLIENT.makeDeleteRequest(`/user/unlike/${mediatorID}`);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while unliking mediator : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "[userService] An error occurred while unliking mediator"
    );
    throw error;
  }
};

const fetchAllLikedMediators = async ({ pageParam, skill }: any) => {
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/user/all-liked?role=MEDIATOR&page=${pageParam}&limit=5&skill=${skill}`
    );
    console.log("Data---", data);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching liked mediators : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching liked mediators"
    );
    throw error;
  }
};

const fetchAllMembers = async ({
  mediatorId,
  pageParam,
  category = "",
}: any) => {
  console.log("mediatorId----", mediatorId);
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/mediator/${mediatorId}/members?page=${pageParam}&limit=3&category=${category}`
    );
    console.log("[userService] member fetched successfully ");
    
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching all members : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching all members"
    );
    throw error;
  }
};

const removeMemberFromTeam = async (payload: any) => {
  try {
    const data = await API_CLIENT.makeDeleteRequest(
      `/mediator/remove-member/${payload?.memberID}`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[mediatorService] An error occurred while removing member : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while removing member from team"
    );
    throw error;
  }
};

const MEDIATOR = {
  getMediatorById,
  fetchAllMediators,
  fetchAllBookedMediators,
  bookMediator,
  removeBookedMediator,
  likeMediator,
  unlikeMediator,
  fetchAllLikedMediators,
  fetchAllMembers,
  removeMemberFromTeam
};

export default MEDIATOR;
