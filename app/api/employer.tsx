import { t } from "@/utils/translationHelper";
import API_CLIENT from ".";
import TOAST from "@/app/hooks/toast";

// Helper function for consistent error handling
const handleServiceError = (error: any, operation: string) => {
  const errorMessage =
    error?.response?.data?.message || `Failed to ${operation}`;
  console.error(`[ServiceAPI] ${operation} failed:`, {
    error: error?.response?.data || error,
    operation,
  });
  TOAST?.error(errorMessage);
  throw error;
};

const addNewService = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePostRequestFormData(
      "/employer/add-service",
      payload
    );
    return data?.data;
  } catch (error: any) {
    handleServiceError(error, "add new service");
  }
};

const editService = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePutRequestFormData(
      "/employer/update-service",
      payload
    );
    return data?.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while updating service : `,
      error?.response?.data
    );
    TOAST?.error(
      error?.response?.data?.message ||
        "An error occurred while updating service"
    );
    throw error;
  }
};

// My Services
const fetchMyServices = async ({ pageParam, status }: any) => {
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/employer/my-services?status=${status}&page=${pageParam}&limit=10`
    );
    return data?.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching my services : `,
      error?.response?.data?.message
    );
    TOAST?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching services"
    );
    throw error;
  }
};

const selectWorker = async (payload: any) => {
  console.log("Paylo---", payload);
  
  try {
    const data = await API_CLIENT.makePostRequest(
      "/employer/application/select",
      payload
    );
    return data.data;
  } catch (error: any) {
    handleServiceError(error, "select worker");
  }
};

const rejectWorker = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePostRequest(
      "/employer/application/reject",
      payload
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while rejecting worker : `,
      error?.response?.data?.message
    );
    TOAST?.error(
      error?.response?.data?.message ||
        "An error occurred while rejecting worker"
    );
    throw error;
  }
};

const cancelSelectedWorker = async (payload: any) => {
  console.log("Payload --", payload);

  try {
    const data = await API_CLIENT.makePostRequest(
      "/employer/selection/cancel",
      payload
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while canceling selected worker : `,
      error?.response?.data?.message
    );
    TOAST?.error(
      error?.response?.data?.message ||
        "An error occurred while canceling selected worker"
    );
    throw error;
  }
};

// BOOKINGS
const addBookingRequest = async (payload: any) => {
  console.log("Payload --", payload);
  
  try {
    const data = await API_CLIENT.makePostRequestFormData(
      "/employer/booking/invitations/send",
      payload
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while sending booking request : `,
      error?.response?.data?.message
    );
    TOAST?.error(
      error?.response?.data?.message ||
        "An error occurred while sending booking request"
    );
    throw error;
  }
};

const fetchAllBookingSentRequests = async ({ pageParam }: any) => {
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/employer/booking/invitations/sent?page=${pageParam}&limit=10`
    );
    return data?.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching sent bookings : `,
      error?.response?.data?.message
    );
    TOAST?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching sent bookings"
    );
    throw error;
  }
};

const cancelBookingRequest = async (payload: any) => {
  console.log("payload", payload);

  try {
    const data = await API_CLIENT.makePostRequest(
      "/employer/booking/invitations/cancel",
      payload
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while cancelling booking request : `,
      error?.response?.data?.message
    );
    TOAST?.error(
      error?.response?.data?.message ||
        "An error occurred while cancelling booking request"
    );
    throw error;
  }
};

const fetchAllBookedWorkers = async ({ pageParam }: any) => {
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/employer/booked-worker/all?page=${pageParam}&limit=10`
    );
    return data?.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching booked workers : `,
      error?.response?.data?.message
    );
    TOAST?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching booked workers"
    );
    throw error;
  }
};

const removeBookedWorker = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePostRequest(
      "/employer/booking/remove-worker",
      payload
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while removing booked worker : `,
      error?.response?.data?.message
    );
    TOAST?.error(
      error?.response?.data?.message ||
        "An error occurred while removing booked worker"
    );
    throw error;
  }
};

const completeBooking = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePostRequest(
      "/employer/booking/complete",
      payload
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while completing booking : `,
      error?.response
    );
    TOAST?.error(
      error?.response?.data?.message ||
        "An error occurred while completing booking"
    );
    throw error;
  }
};

const restoreService = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePostRequest(
      "/employer/restore-service",
      payload
    );
    return data.data;
  } catch (error: any) {
    handleServiceError(error, "restore service");
  }
};

const EMPLOYER = {
  addNewService,
  editService,
  fetchMyServices,
  selectWorker,
  rejectWorker,
  cancelSelectedWorker,
  addBookingRequest,
  cancelBookingRequest,
  fetchAllBookingSentRequests,
  fetchAllBookedWorkers,
  removeBookedWorker,
  completeBooking,
  restoreService,
};

export default EMPLOYER;
