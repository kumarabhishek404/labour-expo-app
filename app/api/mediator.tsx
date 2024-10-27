import { makeDeleteRequest, makeGetRequest, makePostRequest } from ".";
import { toast } from "../hooks/toast";

export const getMediatorById = async (id: any) => {
  try {
    const { data } = await makeGetRequest(`/mediator/detail/${id}`);
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
      `/mediator/all?page=${pageParam}&limit=5`
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

export const fetchAllBookedMediators = async ({ pageParam }: any) => {
  try {
    const data = await makeGetRequest(
      `/mediator/all-booked?page=${pageParam}&limit=5`
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
  try {
    const data = await makePostRequest("/mediator/like", payload);
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

export const unlikeMediator = async ({mediatorID}: any) => {
  try {
    const data = await makeDeleteRequest(
      `/mediator/remove-liked/${mediatorID}`
    );
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

export const fetchAllLikedMediators = async ({ pageParam }: any) => {
  try {
    const data = await makeGetRequest(
      `/mediator/all-liked?page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching liked employers : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching employers"
    );
    throw error;
  }
};
