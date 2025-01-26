import API_CLIENT from ".";
import TOAST from "@/app/hooks/toast";

const getWorkerById = async (id: any) => {
  try {
    const { data } = await API_CLIENT.makeGetRequest(`/user/detail/${id}`);
    return data;
  } catch (error: any) {
    console.error(
      `[Users] [userService] An error occurred while fetching worker details : `,
      error
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while getting service by id"
    );
    throw error;
  }
};

const fetchAllWorkers = async ({ pageParam, skill }: any) => {
  console.log("Payload ---", pageParam, skill);

  try {
    const data = await API_CLIENT.makeGetRequest(
      `/user/all?page=${pageParam}&limit=5&skill=${skill}&role=WORKER`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching workers : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching services"
    );
    throw error;
  }
};

const fetchAllLikedWorkers = async ({ pageParam, skill }: any) => {
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/user/all-liked?role=WORKER&skill=${skill}&page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching liked workers : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching services"
    );
    throw error;
  }
};

const likeWorker = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePostRequest(`/user/like/${payload?.workerID}`);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while liking worker : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching services"
    );
    throw error;
  }
};

const unlikeWorker = async ({ workerID }: any) => {
  console.log("Worker ID---", workerID);
  try {
    const data = await API_CLIENT.makeDeleteRequest(`/user/unlike/${workerID}`);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while unliking worker : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching services"
    );
    throw error;
  }
};

const addSkills = async (payload: any) => {
  console.log("payloet--", payload);

  try {
    const data = await API_CLIENT.makePostRequest("/user/add-skill", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while adding skills in the worker : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while adding skills in the worker"
    );
    throw error;
  }
};

const removeSkill = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePostRequest("/user/remove-skill", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while remove skill from the user profile : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while remove skill from the user profile"
    );
    throw error;
  }
};

const WORKER = {
  getWorkerById,
  fetchAllWorkers,
  fetchAllLikedWorkers,
  likeWorker,
  unlikeWorker,
  addSkills,
  removeSkill,
};

export default WORKER;
