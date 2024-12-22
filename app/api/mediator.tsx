import { makeDeleteRequest, makeGetRequest, makePostRequest } from ".";
import { toast } from "../hooks/toast";

export const getMediatorById = async (id: any) => {
  try {
    const { data } = await makeGetRequest(`/user/detail/${id}`);
    return data;
  } catch (error: any) {
    console.error(
      `An error occurred while fetching mediator details : `,
      error
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while getting mediator by id"
    );
    throw error;
  }
};

export const fetchAllMediators = async ({ pageParam, skill }: any) => {
  try {
    const data = await makeGetRequest(
      `/user/all?page=${pageParam}&limit=5&skill=${skill}&role=MEDIATOR`
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

export const fetchAllBookedMediators = async ({ pageParam, skill }: any) => {
  try {
    const data = await makeGetRequest(
      `/mediator/all-booked?page=${pageParam}&limit=5&skill=${skill}`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching booked mediators : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching booked mediators"
    );
    throw error;
  }
};

export const bookMediator = async (payload: any) => {
  try {
    const data = await makePostRequest("/mediator/book", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while booking mediator : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while booking mediators"
    );
    throw error;
  }
};

export const removeBookedMediator = async (payload: any) => {
  console.log("Payload---", payload);

  try {
    const data = await makeDeleteRequest(
      `/mediator/remove-booked/${payload?.mediatorID}`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while removing booked mediators : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while removing booked mediators"
    );
    throw error;
  }
};

export const likeMediator = async (payload: any) => {
  console.log("Payload---", payload);
  try {
    const data = await makePostRequest(`/user/like/${payload?.mediatorID}`);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while liking mediator : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching services"
    );
    throw error;
  }
};

export const unlikeMediator = async ({ mediatorID }: any) => {
  console.log("Payload---", mediatorID);
  try {
    const data = await makeDeleteRequest(`/user/unlike/${mediatorID}`);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while unliking mediator : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "[userService] An error occurred while unliking mediator"
    );
    throw error;
  }
};

export const fetchAllLikedMediators = async ({ pageParam, skill }: any) => {
  try {
    const data = await makeGetRequest(
      `/user/all-liked?role=MEDIATOR&page=${pageParam}&limit=5&skill=${skill}`
    );
    console.log("Data---", data);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching liked mediators : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching liked mediators"
    );
    throw error;
  }
};

export const fetchAllMembers = async ({ pageParam, category }: any) => {
  try {
    const data = await makeGetRequest(
      `/mediator/members?page=${pageParam}&limit=3&category=${category}`
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

export const leaveTeam = async () => {
  try {
    const data = await makePostRequest(`/user/leave-org`);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while leaving team : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message || "An error occurred while leaving team"
    );
    throw error;
  }
};
