import {
  makeDeleteRequest,
  makeGetRequest,
  makePostRequest,
  makePutRequest,
} from ".";
import { toast } from "../hooks/toast";

export const addReview = async (payload: any) => {
  console.log("Payload --", payload);
  try {
    const data = await makePostRequest(
      `/review/add/${payload?.id}`,
      payload?.data
    );
    toast.success("Review added successfully");
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while adding review : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message || "An error occurred while adding review"
    );
    throw error;
  }
};

export const editReview = async (payload: any) => {
  console.log("Payload --", payload);
  try {
    const data = await makePutRequest(
      `/review/update/${payload?.id}`,
      payload?.data
    );
    toast.success("Review edited successfully");
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while editing review : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message || "An error occurred while editing review"
    );
    throw error;
  }
};

export const deleteReview = async (payload: any) => {
  console.log("Payload --", payload);
  try {
    const data = await makeDeleteRequest(`/review/delete/${payload?.id}`);
    toast.success("Review deleted successfully");
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while deleting review : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while deleting review"
    );
    throw error;
  }
};

export const getAllReviews = async (payload: any) => {
  try {
    const data = await makeGetRequest(`/review/all/${payload?.id}`);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching reviews : `,
      error?.response?.data?.message
    );
    throw error;
  }
};
