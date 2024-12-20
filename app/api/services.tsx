import {
  makeDeleteRequest,
  makeGetRequest,
  makePostRequest,
  makePostRequestFormData,
  makePutRequest,
  makePutRequestFormData,
} from ".";
import { toast } from "../hooks/toast";

export const addNewService = async (payload: any) => {
  try {
    const data = await makePostRequestFormData(
      "/employer/add-service",
      payload
    );
    toast.success("Service added successfully");
    return data?.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while adding new service : `,
      error?.response?.data
    );
    toast.error(
      error?.response?.data?.message || "An error occurred while adding service"
    );
    throw error;
  }
};

export const editService = async (payload: any) => {
  console.log("Payload --", payload);
  try {
    const data = await makePutRequestFormData(
      "/employer/update-service",
      payload
    );
    toast.success("Service updated successfully");
    return data?.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while updating service : `,
      error?.response?.data
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while updating service"
    );
    throw error;
  }
};

export const getServiceById = async (id: any) => {
  try {
    const { data } = await makeGetRequest(`/service/service-info/${id}`);
    return data;
  } catch (error: any) {
    console.error(
      `[Users] [userService] An error occurred while fetching service details : `,
      error
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching service details"
    );
    throw error;
  }
};

export const deleteServiceById = async (id: any) => {
  try {
    const data = await makePostRequest(`/employer/cancel-service`, {
      serviceId: id,
    });
    toast.success("Service deleted successfully");
    return data.data;
  } catch (error: any) {
    console.error(
      `[Users] [userService] An error occurred while deleting service : `,
      error
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while deleting service"
    );
    throw error;
  }
};

export const fetchAllServices = async ({ pageParam, status }: any) => {
  try {
    const data = await makeGetRequest(
      `/service/all?status=${status}&page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching services : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching services"
    );
    throw error;
  }
};

export const fetchAllLikedServices = async ({ pageParam }: any) => {
  try {
    const data = await makeGetRequest(
      `/service/all-liked?page${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching services : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching services"
    );
    throw error;
  }
};

export const likeService = async (payload: any) => {
  try {
    const data = await makePostRequest("/user/like-service", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while liking service : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching services"
    );
    throw error;
  }
};

export const unLikeService = async (payload: any) => {
  try {
    const data = await makePostRequest("/user/unlike-service", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while unliking service : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching services"
    );
    throw error;
  }
};

// My Services
export const fetchMyServices = async ({ pageParam, status }: any) => {
  try {
    const data = await makeGetRequest(
      `/employer/my-services?status=${status}&page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching my services : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching services"
    );
    throw error;
  }
};

// Apply
export const fetchMyAppliedServicesWorker = async ({ pageParam }: any) => {
  try {
    const data = await makeGetRequest(
      `/worker/applied-services?page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching my applied services : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching my applied services"
    );
    throw error;
  }
};

export const fetchServicesInWhichSelectedWorker = async ({
  pageParam,
}: any) => {
  try {
    const data = await makeGetRequest(
      `/worker/selected-services?page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching my selected services : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching my selected services"
    );
    throw error;
  }
};

export const applyService = async (payload: any) => {
  try {
    const data = await makePostRequest("/worker/apply", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while applying in service : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while applying in service"
    );
    throw error;
  }
};

export const unApplyService = async (payload: any) => {
  try {
    const data = await makePostRequest("/worker/cancel-apply", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while cancel applying the service : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while cancel apply service"
    );
    throw error;
  }
};

export const cancelServiceByWorkerAfterSelection = async (payload: any) => {
  try {
    const data = await makePostRequest(
      `/worker/cancel/worker/${payload?.serviceId}`,
      payload
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while removing worker after selection : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while removing worker after selection"
    );
    throw error;
  }
};

export const cancelServiceByMediatorAfterSelection = async (payload: any) => {
  try {
    const data = await makePostRequest(
      `/mediator/cancel/mediator/${payload?.serviceId}`,
      payload
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while removing mediator after selection : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while removing mediator after selection"
    );
    throw error;
  }
};

export const fetchMyAppliedServicesMediator = async ({ pageParam }: any) => {
  try {
    const data = await makeGetRequest(
      `/mediator/applied-services?page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching my applied services : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching my applied services"
    );
    throw error;
  }
};

export const fetchServicesInWhichSelectedMediator = async ({
  pageParam,
}: any) => {
  try {
    const data = await makeGetRequest(
      `/mediator/selected-services?page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching services in which selected mediator : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching services in which selected mediator"
    );
    throw error;
  }
};

export const mediatorApplyService = async (payload: any) => {
  console.log("Payload ----", payload);

  try {
    const data = await makePostRequest("/mediator/apply", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while applying service by mediator : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while applying service by mediator : "
    );
    throw error;
  }
};

export const mediatorUnApplyService = async (payload: any) => {
  try {
    const data = await makePostRequest("/mediator/cancel-apply", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while unapplying service by mediator : `,
      error?.response?.data?.message
    );
    throw error;
  }
};

// Applicants
export const fetchMyAppliedWorkers = async ({ pageParam, serviceId }: any) => {
  try {
    const data = await makeGetRequest(
      `/service/${serviceId}/applied/workers?page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching all applied workers : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching all applied workers"
    );
    throw error;
  }
};

export const fetchMyAppliedMediators = async ({
  pageParam,
  serviceId,
}: any) => {
  try {
    const data = await makeGetRequest(
      `/service/${serviceId}/applied/mediators?page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching all applied mediators : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching all applied mediators"
    );
    throw error;
  }
};

export const selectWorker = async (payload: any) => {
  console.log("Patload---", payload);

  try {
    const data = await makePostRequest("employer/worker/select", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while selecting worker : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while selecting worker"
    );
    throw error;
  }
};

export const selectMediator = async (payload: any) => {
  console.log("Patload---", payload);

  try {
    const data = await makePostRequest("employer/mediator/select", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while selecting mediator : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while selecting mediator"
    );
    throw error;
  }
};

export const rejectWorker = async (payload: any) => {
  console.log("Payload --", payload);
  try {
    const data = await makePostRequest("employer/worker/reject", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while rejecting worker : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while rejecting worker"
    );
    throw error;
  }
};

export const rejectMediator = async (payload: any) => {
  console.log("Payload --", payload);
  try {
    const data = await makePostRequest("/employer/mediator/reject", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while rejecting mediator : `,
      error?.response?.data?.message
    );
    throw error;
  }
};

export const cancelSelectedWorker = async (payload: any) => {
  console.log("Payload --", payload);

  try {
    const data = await makePostRequest("employer/cancel/worker", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while canceling selected worker : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while canceling selected worker"
    );
    throw error;
  }
};

export const cancelSelectedMediator = async (payload: any) => {
  console.log("Payload --", payload);

  try {
    const data = await makePostRequest("employer/cancel/mediator", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while canceling selected mediator : `,
      error?.response?.data?.message
    );
    throw error;
  }
};

export const fetchSelectedWorkers = async ({ pageParam, serviceId }: any) => {
  try {
    const data = await makeGetRequest(
      `/service/${serviceId}/selected/workers?page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching selected workers of service : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching selected workers of service"
    );
    throw error;
  }
};

export const fetchSelectedMediators = async ({ pageParam, serviceId }: any) => {
  try {
    const data = await makeGetRequest(
      `/service/${serviceId}/selected/mediators?page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching selected mediators of service : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching selected mediators of service"
    );
    throw error;
  }
};

export const completeService = async (payload: any) => {
  try {
    const data = await makePostRequest(`/employer/complete-service`, payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while completing service : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while completing service"
    );
    throw error;
  }
};
