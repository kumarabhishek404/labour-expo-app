import API_CLIENT from ".";
import TOAST from "@/app/hooks/toast";

const getEmployerById = async (id: any) => {
  try {
    const { data } = await API_CLIENT.makeGetRequest(`/user/detail/${id}`);
    return data;
  } catch (error: any) {
    console.error(
      `[Users] [userService] An error occurred while fetching employer details : `,
      error
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while getting employer by id"
    );
    throw error;
  }
};

const fetchAllEmployers = async ({ pageParam }: any) => {
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/user/all?page=${pageParam}&limit=5&role=EMPLOYER`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching employers : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching employers"
    );
    throw error;
  }
};

const fetchAllLikedEmployer = async ({ pageParam }: any) => {
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/user/all-liked?role=EMPLOYER&page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching liked employers : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching employers"
    );
    throw error;
  }
};

const likeEmployer = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePostRequest(`/user/like/${payload?.employerID}`);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while liking employer : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching employer"
    );
    throw error;
  }
};

const unlikeEmployer = async (payload: any) => {
  try {
    const data = await API_CLIENT.makeDeleteRequest(`/user/unlike/${payload?.employerID}`);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while unliking employer : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching employer"
    );
    throw error;
  }
};

const EMPLOYER = {
  getEmployerById,
  fetchAllEmployers,
  fetchAllLikedEmployer,
  likeEmployer,
  unlikeEmployer,
};

export default EMPLOYER;
