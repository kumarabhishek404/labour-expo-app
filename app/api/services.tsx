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
    const data = await makePostRequestFormData("/service/add", payload);
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
  try {
    const data = await makePostRequestFormData(
      "/service/update-service",
      payload
    );
    toast.success("Service updated successfully");
    return data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while updating service : `,
      error?.response?.data?.message
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
    const data = await makeDeleteRequest(`/service/delete/${id}`);
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

export const fetchAllServices = async ({ pageParam, type }: any) => {
  try {
    const data = await makeGetRequest(
      `/service/all?page=${pageParam}&limit=10&type=${type}`
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
    const data = await makePostRequest("/service/like", payload);
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
    const data = await makePostRequest("/service/remove-liked", payload);
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
export const fetchMyServices = async ({ pageParam, type }: any) => {
  try {
    const data = await makeGetRequest(
      `/service/my-services?page=${pageParam}&limit=5&type=${type}`
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
export const fetchMyAppliedServices = async ({ pageParam }: any) => {
  try {
    const data = await makeGetRequest(
      `/service/all-applied?page=${pageParam}&limit=5`
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

export const applyService = async (payload: any) => {
  try {
    const data = await makePostRequest("/service/apply", payload);
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
    const data = await makePostRequest("/service/cancel-apply", payload);
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

// Applicants
export const fetchMyApplicants = async ({ pageParam, serviceId }: any) => {
  try {
    const data = await makeGetRequest(
      `/service/applied/${serviceId}?page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching all applicants : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching all applicants"
    );
    throw error;
  }
};

export const selectFromApplicant = async (payload: any) => {
  console.log("Patload---", payload);

  try {
    const data = await makePostRequest("/service/select", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while selecting applicant : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while selecting applicant"
    );
    throw error;
  }
};

export const rejectApplicant = async (payload: any) => {
  try {
    const data = await makeDeleteRequest("/service/reject", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while rejecting applicant : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while rejecting applicant"
    );
    throw error;
  }
};

export const cancelSeletedApplicant = async (payload: any) => {
  console.log("Payload --", payload);

  try {
    const data = await makePostRequest("/service/cancel-selected", payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while canceling selected applicant : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while canceling selected applicant"
    );
    throw error;
  }
};

export const fetchSelectedCandidates = async ({
  pageParam,
  serviceId,
}: any) => {
  try {
    const data = await makeGetRequest(
      `/service/selected/${serviceId}?page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching selected candidates of service : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while fetching selected candidates of service"
    );
    throw error;
  }
};

export const completeService = async (payload: any) => {
  try {
    const data = await makePostRequest(`/service/complete`, payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while cancelling service : `,
      error?.response?.data?.message
    );
    toast.error(
      error?.response?.data?.message ||
        "An error occurred while cancelling service"
    );
    throw error;
  }
};
