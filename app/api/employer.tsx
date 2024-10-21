import { makeGetRequest, makePostRequest } from ".";
import { toast } from "../hooks/toast";

export const getEmployerById = async (id: any) => {
  try {
    const { data } = await makeGetRequest(`/employer/detail/${id}`);
    return data;
  } catch (error: any) {
    console.error(
      `[Users] [userService] An error occurred while fetching employer details : `,
      error
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while getting employer by id"
    );
    throw error;
  }
};

export const fetchAllEmployers = async ({ pageParam }: any) => {
  try {
    const data = await makeGetRequest(
      `/employer/all?page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching employers : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching employers"
    );
    throw error;
  }
};

export const fetchAllLikedEmployer = async ({ pageParam }: any) => {
  try {
    const data = await makeGetRequest(
      `/employer/all-bookmarks-employer?page=${pageParam}&limit=5`
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

export const likeEmployer = async (payload: any) => {
  try {
    const data = await makePostRequest("/employer/bookmark-employer", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while liking employer : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching employer"
    );
    throw error;
  }
};

export const unlikeEmployer = async (payload: any) => {
  try {
    const data = await makePostRequest(
      "/employer/unbookmark-employer",
      payload
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while unliking employer : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching employer"
    );
    throw error;
  }
};
