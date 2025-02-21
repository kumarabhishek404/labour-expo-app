import API_CLIENT from ".";
import TOAST from "../hooks/toast";

const addAttendance = async (serviceId: any, payload: any) => {
  console.log("Paylaod --", serviceId, payload);

  try {
    const data = await API_CLIENT.makePostRequest(
      `/employer/attendance/${serviceId}`,
      payload
    );
    return data?.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while adding attendance for the booked workers : `,
      error?.response?.data
    );
    TOAST?.error(
      error?.response?.data?.message ||
        "An error occurred while adding attendance for the booked workers "
    );
  }
};

const getAllAttendanceReports = async (serviceId: any) => {
  try {
    const data = await API_CLIENT.makeGetRequest(
      `/employer/attendance/${serviceId}/report`
    );
    return data.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching attendance report : `,
      error?.response?.data?.message
    );
    TOAST?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching attendance report"
    );
    throw error;
  }
};

const ATTENDANCE = {
  addAttendance,
  getAllAttendanceReports,
};

export default ATTENDANCE;
