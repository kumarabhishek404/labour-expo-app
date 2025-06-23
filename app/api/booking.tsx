// api/bookings.ts
import axios from "axios";
import API_CLIENT from ".";
import TOAST from "../hooks/toast";

// My Bookings
const fetchBookingsByMobile = async (mobileNumber: string) => {
  console.log(
    "[userService] Fetching bookings for mobile number: ",
    mobileNumber
  );

  try {
    const data = await API_CLIENT.makeGetRequest(`/booking/${mobileNumber}`);
    console.log("[userService] My bookings data: ", data);

    return data?.data;
  } catch (error: any) {
    console.error(
      `[userService] An error occurred while fetching my bookings : `,
      error?.response?.data?.message
    );
    TOAST?.error(
      error?.response?.data?.message ||
        "An error occurred while fetching bookings"
    );
    throw error;
  }
};

const BOOKINGS = {
  fetchBookingsByMobile,
};

export default BOOKINGS;
