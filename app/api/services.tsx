import {
  makeDeleteRequest,
  makeGetRequest,
  makePostRequest,
  makePostRequestFormData,
  makePutRequest,
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
  console.log("Payload inside api - ", payload);

  try {
    const data = await makePutRequest("/service/update-service", payload);
    toast.success("Service updated successfully");
    return data?.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while updating service : `,
      error?.response?.data
    );
    toast.error(
      error?.response?.data?.message || "An error occurred while updating service"
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
          'An error occurred while fetching service details',
      );
    throw error;
  }
};

export const deleteServiceById = async (id: any) => {
  console.log("Click delete ---", id);
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

export const fetchAllServices = async ({ pageParam }: any) => {
  try {
    const data = await makeGetRequest(
      `/service/all?page=${pageParam}&limit=10`
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
      `/service/liked-services?page${pageParam}&limit=5`
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
  console.log("Payload --", payload);

  try {
    const data = await makePostRequest("/service/like-service", payload);
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
    const data = await makePostRequest("/service/unlike-service", payload);
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
export const fetchMyServices = async ({ pageParam }: any) => {
  try {
    const data = await makeGetRequest(
      `/service/my-services?page=${pageParam}&limit=5`
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
      `/service/my-apply?page=${pageParam}&limit=5`
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
export const fetchMyApplicants = async ({ pageParam, id }: any) => {
  try {
    const data = await makeGetRequest(
      `/service/applied/${id}?page=${pageParam}&limit=5`
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
