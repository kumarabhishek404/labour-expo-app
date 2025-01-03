import { makeDeleteRequest, makeGetRequest, makePostRequest } from ".";
import { toast } from "../hooks/toast";

export const getEmployerById = async (id: any) => {
  try {
    const { data } = await makeGetRequest(`/user/detail/${id}`);
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
      `/user/all?page=${pageParam}&limit=5&role=EMPLOYER`
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
      `/user/all-liked?role=EMPLOYER&page=${pageParam}&limit=5`
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
    const data = await makePostRequest(`/user/like/${payload?.employerID}`);
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
    const data = await makeDeleteRequest(`/user/unlike/${payload?.employerID}`);
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
