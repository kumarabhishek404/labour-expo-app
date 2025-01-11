import { makePatchRequest, makePostRequest } from ".";
import { toast } from "../hooks/toast";

export const submitUserProblem = async (payload: any) => {
  try {
    const data = await makePostRequest("/userProblem/submit", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while submitting problem : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while while submitting problem"
    );
    throw error;
  }
};

export const cancelUserProblem = async (payload: any) => {
  try {
    const data = await makePatchRequest(
      `/userProblem/${payload?.problemId}/cancel`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while cancelling problem : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while while cancelling problem"
    );
    throw error;
  }
};

export const completeUserProblem = async (payload: any) => {
  try {
    const data = await makePatchRequest(
      `/userProblem/${payload?.problemId}/complete`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while completing problem : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while while completing problem"
    );
    throw error;
  }
};
