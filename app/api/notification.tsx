import API_CLIENT from ".";
import TOAST from "@/app/hooks/toast";

const fetchAllNotifications = async ({ pageParam }: any) => {
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/notification/all?page=${pageParam}&limit=10`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching all notifications : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching all notifications"
    );
    throw error;
  }
};

const fetchUnreadNotificationsCount = async () => {
  try {
    const data = await API_CLIENT.makeGetRequest(`/notification/unread-count`);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching unread notifications count : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching unread notifications count "
    );
    throw error;
  }
};

const markAsReadNotification = async (payload: any) => {
  console.log("payloaf --", payload);

  try {
    const data = await API_CLIENT.makePutRequest(`/notification/mark-read`, payload);
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while marking as read notification : `,
      error?.response?.data?.message
    );
    TOAST?.showToast?.error(
      error?.response?.data?.message ||
        "An error occurred while marking as read notification"
    );
    throw error;
  }
};

const NOTIFICATION = {
  fetchUnreadNotificationsCount,
  fetchAllNotifications,
  markAsReadNotification,
};

export default NOTIFICATION;
