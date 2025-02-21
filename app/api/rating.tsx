import API_CLIENT from ".";
import TOAST from "@/app/hooks/toast";

const addReview = async (payload: any) => {
  console.log("Payload --", payload);
  try {
    const data = await API_CLIENT.makePostRequest(
      `/review/add/${payload?.id}`,
      payload?.data
    );
    TOAST?.success("Review added successfully");
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while adding review : `,
      error?.response?.data?.message
    );
    TOAST?.error(
      error?.response?.data?.message || "An error occurred while adding review"
    );
    throw error;
  }
};

const editReview = async (payload: any) => {
  console.log("Payload --", payload);
  try {
    const data = await API_CLIENT.makePutRequest(
      `/review/update/${payload?.id}`,
      payload?.data
    );
    TOAST?.success("Review edited successfully");
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while editing review : `,
      error?.response?.data?.message
    );
    TOAST?.error(
      error?.response?.data?.message || "An error occurred while editing review"
    );
    throw error;
  }
};

const deleteReview = async (payload: any) => {
  console.log("Payload --", payload);
  try {
    const data = await API_CLIENT.makeDeleteRequest(
      `/review/delete/${payload?.id}`
    );
    TOAST?.success("Review deleted successfully");
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while deleting review : `,
      error?.response?.data?.message
    );
    TOAST?.error(
      error?.response?.data?.message ||
        "An error occurred while deleting review"
    );
    throw error;
  }
};

const getAllReviews = async (payload: any) => {
  try {
    const data = await API_CLIENT.makeGetRequest(`/review/all/${payload?.id}`);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching reviews : `,
      error?.response?.data?.message
    );
    throw error;
  }
};

const NOTIFICATION = {
  addReview,
  editReview,
  deleteReview,
  getAllReviews,
};

export default NOTIFICATION;
