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

const getServiceById = async (id: any) => {
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

const fetchAllServices = async ({
  pageParam,
  status,
  type,
  subType,
  skill,
}: any) => {
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/service/all?status=${status}&type=${type}&subType=${subType}&skill=${skill}&page=${pageParam}&limit=5`
    );
    return data.data;
  } catch (error: any) {
    handleServiceError(error, "fetch services");
  }
};

const fetchMyAppliedWorkers = async ({ pageParam, serviceId }: any) => {
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/service/${serviceId}/applied/users?page=${pageParam}&limit=5`
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

const fetchSelectedWorkers = async ({ pageParam, serviceId }: any) => {
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/service/${serviceId}/selected/users?page=${pageParam}&limit=5`
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

const fetchAllVillages = async (payload: any) => {
  console.log("Paylaod ---", payload);
  
  try {
    const data = await API_CLIENT.makePostRequest(`/service/villages`, payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching villages of selected state : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching villages of selected state"
    );
    throw error;
  }
};

const SERVICE = {
  fetchAllServices,
  getServiceById,
  fetchMyAppliedWorkers,
  fetchSelectedWorkers,
  fetchAllVillages
};

export default SERVICE;
