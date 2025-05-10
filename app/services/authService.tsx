import { saveToken } from "@/utils/authStorage";
import AUTH from "../api/auth";
import REFRESH_USER from "../hooks/useRefreshUser";
import { router } from "expo-router";
import { fetchCurrentLocation } from "@/constants/functions";
import USER from "../api/user";
import PUSH_NOTIFICATION from "../hooks/usePushNotification";

const loginUser = async (mobile: string, password: string) => {
  const { refreshUser } = REFRESH_USER.useRefreshUser();
  try {
    // Simulate API call (replace with real login API)
    const response: any = await AUTH?.signIn({ mobile, password });

    if (!response?.token) throw new Error("No token returned");

    const authToken = response.token;
    await saveToken(authToken);
    // await setToken(authToken);

    const updatedUser: any = await refreshUser();
    if (!updatedUser) throw new Error("Failed to fetch updated user info");

    if (updatedUser?.status !== "ACTIVE") {
      // setUserDetails({ isAuth: true, ...updatedUser });
      // setIsLoggedIn(true);
      router.replace("/(tabs)/fifth");
      return { success: true, user: updatedUser };
    }

    if (!updatedUser?.profilePicture) {
      // setUserDetails({ isAuth: true, ...updatedUser });
      // setIsLoggedIn(true);
      router.replace({
        pathname: "/screens/auth/register/fourth",
        params: { userId: updatedUser._id },
      });
      return { success: true, user: updatedUser };
    }

    if (!updatedUser?.location?.latitude || !updatedUser?.location?.longitude) {
      const locationData = await fetchCurrentLocation();
      if (locationData) {
        await USER?.updateUserById({
          _id: updatedUser._id,
          location: locationData.location,
        });
      }
    }

    await PUSH_NOTIFICATION?.registerForPushNotificationsAsync(
      updatedUser?.notificationConsent
    );

    // setUserDetails({ isAuth: true, ...updatedUser });
    // setIsLoggedIn(true);
    router.replace("/(tabs)");

    return { success: true, user: updatedUser };
  } catch (err: any) {
    const errorCode = err?.response?.data?.errorCode;
    const userId = err?.response?.data?.userId;
    const token = err?.response?.data?.token;

    if (
      errorCode === "SET_PASSWORD_FIRST" ||
      errorCode === "SET_PROFILE_PICTURE_FIRST"
    ) {
      await saveToken(token);

      const route =
        errorCode === "SET_PASSWORD_FIRST"
          ? "/screens/auth/register/second"
          : "/screens/auth/register/fourth";

      router.replace({ pathname: route, params: { userId } });

      return { success: false, redirectNeeded: true };
    }

    throw err; // for other unexpected errors
  }
};


export default loginUser;