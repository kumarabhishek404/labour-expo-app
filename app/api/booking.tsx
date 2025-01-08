import {
  makeDeleteRequest,
  makeGetRequest,
  makePostRequest,
  makePostRequestFormData,
} from ".";
import { toast } from "../hooks/toast";

export const fetchAllBookingSentRequests = async ({ pageParam }: any) => {
  console.log("pageParam", pageParam);
  try {
    const data = await makeGetRequest(
      `/employer/invitations/sent?page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching sent bookings : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching sent bookings"
    );
    throw error;
  }
};

export const fetchAllBookingReceivedRequests = async ({ pageParam }: any) => {
  try {
    const data = await makeGetRequest(
      `/user/invitation/received?page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching recieved booking requests : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching recieved booking requests"
    );
    throw error;
  }
};

export const fetchAllBookedWorkers = async ({ pageParam }: any) => {
  try {
    const data = await makeGetRequest(
      `/employer/bookings/all?page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching booked workers : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching booked workers"
    );
    throw error;
  }
};

export const fetchAllMyBookings = async ({ pageParam }: any) => {
  try {
    const data = await makeGetRequest(
      `/user/booked/all?page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching my bookings : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching my bookings"
    );
    throw error;
  }
};

export const addBookingRequest = async (payload: any) => {
  try {
    const data = await makePostRequestFormData(
      "/employer/invitations/send",
      payload
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while sending booking request : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while sending booking request"
    );
    throw error;
  }
};

export const cancelBookingRequest = async (payload: any) => {
  console.log("payload", payload);

  try {
    const data = await makePostRequest("/employer/invitations/cancel", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while cancelling booking request : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while cancelling booking request"
    );
    throw error;
  }
};

export const acceptBookingRequest = async (payload: any) => {
  try {
    const data = await makePostRequest("/user/invitation/accept", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while accepting booking request : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while accepting booking request"
    );
    throw error;
  }
};

export const rejectBookingRequest = async (payload: any) => {
  try {
    const data = await makePostRequest("/user/invitation/reject", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while rejecting booking request : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while rejecting booking request"
    );
    throw error;
  }
};

export const removeBookedWorker = async (payload: any) => {
  try {
    const data = await makePostRequest("/employer/bookings/remove", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while removing booked worker : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while removing booked worker"
    );
    throw error;
  }
};

export const cancelBooking = async (payload: any) => {
  try {
    const data = await makePostRequest("/user/booked/cancel", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while cancelling booking : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while cancelling booking"
    );
    throw error;
  }
};

export const completeBooking = async (payload: any) => {
  try {
    const data = await makePostRequest("/employer/invitations/complete", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while completing booking : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while completing booking"
    );
    throw error;
  }
};
