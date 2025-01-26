
import API_CLIENT from ".";
import TOAST from "@/app/hooks/toast";

const fetchAllBookingSentRequests = async ({ pageParam }: any) => {
  console.log("pageParam", pageParam);
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/employer/invitations/sent?page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching sent bookings : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching sent bookings"
    );
    throw error;
  }
};

const fetchAllBookingReceivedRequests = async ({ pageParam }: any) => {
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/user/invitation/received?page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching recieved booking requests : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching recieved booking requests"
    );
    throw error;
  }
};

const fetchAllBookedWorkers = async ({ pageParam }: any) => {
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/employer/bookings/all?page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching booked workers : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching booked workers"
    );
    throw error;
  }
};

const fetchAllMyBookings = async ({ pageParam }: any) => {
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/user/booked/all?page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching my bookings : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching my bookings"
    );
    throw error;
  }
};

const addBookingRequest = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePostRequestFormData(
      "/employer/invitations/send",
      payload
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while sending booking request : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while sending booking request"
    );
    throw error;
  }
};

const cancelBookingRequest = async (payload: any) => {
  console.log("payload", payload);

  try {
    const data = await API_CLIENT.makePostRequest("/employer/invitations/cancel", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while cancelling booking request : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while cancelling booking request"
    );
    throw error;
  }
};

const acceptBookingRequest = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePostRequest("/user/invitation/accept", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while accepting booking request : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while accepting booking request"
    );
    throw error;
  }
};

const rejectBookingRequest = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePostRequest("/user/invitation/reject", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while rejecting booking request : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while rejecting booking request"
    );
    throw error;
  }
};

const removeBookedWorker = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePostRequest("/employer/bookings/remove", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while removing booked worker : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while removing booked worker"
    );
    throw error;
  }
};

const cancelBooking = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePostRequest("/user/booked/cancel", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while cancelling booking : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while cancelling booking"
    );
    throw error;
  }
};

const completeBooking = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePostRequest(
      "/employer/invitations/complete",
      payload
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while completing booking : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while completing booking"
    );
    throw error;
  }
};

const BOOKING = {
  fetchAllBookingSentRequests,
  fetchAllBookingReceivedRequests,
  fetchAllBookedWorkers,
  fetchAllMyBookings,
  addBookingRequest,
  cancelBookingRequest,
  acceptBookingRequest,
  rejectBookingRequest,
  removeBookedWorker,
  cancelBooking,
  completeBooking,
};

export default BOOKING;
