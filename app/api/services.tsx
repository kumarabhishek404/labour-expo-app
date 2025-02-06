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
  TOAST?.showToast?.error(errorMessage);
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
  console.log("Payload --", payload);
  try {
    const data = await API_CLIENT.makePutRequestFormData(
      "/employer/update-service",
      payload
    );
    TOAST?.showToast?.success(t("serviceUpdatedSuccessfully"));
    return data?.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while updating service : `,
      error?.response?.data
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while updating service"
    );
    throw error;
  }
};

const getServiceById = async (id: any) => {
  console.log("id--", id);

  try {
    const { data } = await API_CLIENT.makeGetRequest(
      `/service/service-info/${id}`
    );
    return data;
  } catch (error: any) {
    console.error(
      `[Users] [userService] An error occurred while fetching service details : `,
      error
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching service details"
    );
    throw error;
  }
};

const deleteServiceById = async (id: any) => {
  try {
    const data = await API_CLIENT.makePostRequest(`/employer/cancel-service`, {
      serviceId: id,
    });
    TOAST?.showToast?.success(t("serviceDeletedSuccessfully"));
    return data.data;
  } catch (error: any) {
    console.error(
      `[Users] [userService] An error occurred while deleting service : `,
      error
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while deleting service"
    );
    throw error;
  }
};

const fetchAllServices = async ({
  pageParam,
  status,
  type,
  subType,
  skill,
}: any) => {
  console.log("Paylaod--service -", pageParam, status, type, subType, skill);

  try {
    const data = await API_CLIENT.makeGetRequest(
      `/service/all?status=${status}&type=${type}&subType=${subType}&skill=${skill}&page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    handleServiceError(error, "fetch services");
  }
};

const fetchAllLikedServices = async ({ pageParam }: any) => {
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/service/all-liked?page${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching services : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching services"
    );
    throw error;
  }
};

const likeService = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePostRequest(
      "/user/like-service",
      payload
    );
    return data.data;
  } catch (error: any) {
    handleServiceError(error, "like service");
  }
};

const unLikeService = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePostRequest(
      "/user/unlike-service",
      payload
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while unliking service : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching services"
    );
    throw error;
  }
};

// My Services
const fetchMyServices = async ({ pageParam, status }: any) => {
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/employer/my-services?status=${status}&page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching my services : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching services"
    );
    throw error;
  }
};

// Apply
const applyService = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePostRequest("/worker/apply", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while applying in service : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while applying in service"
    );
    throw error;
  }
};

const unApplyService = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePostRequest(
      "/worker/cancel-apply",
      payload
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while cancel applying the service : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while cancel apply service"
    );
    throw error;
  }
};

const fetchAllMyBookingsWorker = async ({ pageParam, status }: any) => {
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/worker/my-bookings?status=${status}&page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching my applied services : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching my applied services"
    );
    throw error;
  }
};

const fetchMyAppliedServicesWorker = async ({ pageParam }: any) => {
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/worker/applied-services?page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching my applied services : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching my applied services"
    );
    throw error;
  }
};

const fetchServicesInWhichSelectedWorker = async ({ pageParam }: any) => {
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/worker/selected-services?page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching my selected services : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching my selected services"
    );
    throw error;
  }
};

const cancelServiceByWorkerAfterSelection = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePostRequest(
      `/worker/cancel/worker/${payload?.serviceId}`,
      payload
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while removing worker after selection : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while removing worker after selection"
    );
    throw error;
  }
};

const cancelServiceByMediatorAfterSelection = async (payload: any) => {
  try {
    const data = await API_CLIENT.makePostRequest(
      `/mediator/cancel/mediator/${payload?.serviceId}`,
      payload
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while removing mediator after selection : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while removing mediator after selection"
    );
    throw error;
  }
};

// Applicants
const fetchMyAppliedWorkers = async ({ pageParam, serviceId }: any) => {
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/service/${serviceId}/applied/workers?page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching all applied workers : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching all applied workers"
    );
    throw error;
  }
};

const selectWorker = async (payload: any) => {
  console.log("Patload---", payload);

  try {
    const data = await API_CLIENT.makePostRequest(
      "employer/worker/select",
      payload
    );
    return data.data;
  } catch (error: any) {
    handleServiceError(error, "select worker");
  }
};

const rejectWorker = async (payload: any) => {
  console.log("Payload --", payload);
  try {
    const data = await API_CLIENT.makePostRequest(
      "employer/worker/reject",
      payload
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while rejecting worker : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
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
      "employer/cancel/worker",
      payload
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while canceling selected worker : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while canceling selected worker"
    );
    throw error;
  }
};

const fetchSelectedWorkers = async ({ pageParam, serviceId }: any) => {
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/service/${serviceId}/selected/workers?page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching selected workers of service : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching selected workers of service"
    );
    throw error;
  }
};

const completeService = async (payload: any) => {
  console.log("Payload --", payload);

  try {
    const data = await API_CLIENT.makePostRequest(
      `/employer/complete-service`,
      payload
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while completing service : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while completing service"
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

const SERVICE = {
  addNewService,
  editService,
  getServiceById,
  deleteServiceById,
  fetchAllServices,
  fetchAllLikedServices,
  likeService,
  unLikeService,
  fetchMyServices,
  fetchAllMyBookingsWorker,
  fetchMyAppliedServicesWorker,
  fetchServicesInWhichSelectedWorker,
  applyService,
  unApplyService,
  cancelServiceByWorkerAfterSelection,
  cancelServiceByMediatorAfterSelection,
  fetchMyAppliedWorkers,
  selectWorker,
  rejectWorker,
  cancelSelectedWorker,
  fetchSelectedWorkers,
  completeService,
  restoreService,
};

export default SERVICE;
