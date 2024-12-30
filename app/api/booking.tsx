import { makeDeleteRequest, makeGetRequest, makePostRequest } from ".";
import { toast } from "../hooks/toast";

export const fetchAllBookingSentRequests = async ({ pageParam }: any) => {
  try {
    const data = await makeGetRequest(
      `/booking/all-sent-booking-requests?page=${pageParam}&limit=5`
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
      `/booking/all-received-booking-requests?page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching recieved bookings : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching recieved bookings"
    );
    throw error;
  }
};

export const fetchAllBookedWorkers = async ({ pageParam }: any) => {
  try {
    const data = await makeGetRequest(
      `/booking/all-booked-workers?page=${pageParam}&limit=5`
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
      `/booking/all-my-bookings?page=${pageParam}&limit=5`
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
    const data = await makePostRequest("/booking/add-booking-request", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while adding booking request : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while adding booking request"
    );
    throw error;
  }
};

export const cancelBookingRequest = async (payload: any) => {
  try {
    const data = await makeDeleteRequest(
      `/booking/cancel-booking-request/${payload?.workerID}`
    );
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
    const data = await makePostRequest(
      `/booking/accept-booking-request/${payload?.workerID}`
    );
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
    const data = await makePostRequest(
      `/booking/reject-booking-request/${payload?.workerID}`
    );
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
    const data = await makeDeleteRequest(
      `/booking/remove-booked-worker/${payload?.workerID}`
    );
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
    const data = await makeDeleteRequest(
      `/booking/cancel-booking/${payload?.bookingID}`
    );
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
    const data = await makePostRequest(
      `/booking/complete-booking/${payload?.bookingID}`
    );
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
