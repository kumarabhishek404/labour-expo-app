import API_CLIENT from ".";
import TOAST from "@/app/hooks/toast";

const submitUserProblem = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePostRequest("/userProblem/submit", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while submitting problem : `,
      error?.response?.data?.message
    );
    TOAST?.error(
      error?.response?.data?.message ||
        "An error occurred while while submitting problem"
    );
    throw error;
  }
};

const cancelUserProblem = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePatchRequest(
      `/userProblem/${payload?.problemId}/cancel`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while cancelling problem : `,
      error?.response?.data?.message
    );
    TOAST?.error(
      error?.response?.data?.message ||
        "An error occurred while while cancelling problem"
    );
    throw error;
  }
};

const completeUserProblem = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePatchRequest(
      `/userProblem/${payload?.problemId}/complete`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while completing problem : `,
      error?.response?.data?.message
    );
    TOAST?.error(
      error?.response?.data?.message ||
        "An error occurred while while completing problem"
    );
    throw error;
  }
};

const USER_PROBLEM = {
  submitUserProblem,
  cancelUserProblem,
  completeUserProblem,
};

export default USER_PROBLEM;
