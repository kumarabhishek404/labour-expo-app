import { useCallback, useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Atoms from "@/app/AtomStore";
import { removeToken } from "@/utils/authStorage";

interface UseLogoutReturn {
  logout: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

const useLogout = (): UseLogoutReturn => {
  const [isLoggedIn, setIsLoggedIn] = useAtom(Atoms?.IsLoggedInAtom);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const setUserDetails = useSetAtom(Atoms?.UserAtom);

  const logout = useCallback(async () => {
    // if (!isLoggedIn) {
    //   console.log("User already logged out. Skipping logout.");
    //   return;
    // }

    console.log("Starting logout...");
    setIsLoading(true);
    setError(null);

    try {
      await AsyncStorage.removeItem("user");
      await removeToken();

      setIsLoggedIn(false);

      console.log("Redirected to login");
      setUserDetails({});
      // router.replace("/screens/auth/login");
    } catch (error: any) {
      const errorMessage = error?.message || "Error during logout";
      setError(new Error(errorMessage));
      console.error("Error during logout:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn, setIsLoggedIn, router]);

  return { logout, isLoading, error };
};

const USE_LOGOUT = {
  useLogout,
};

export default USE_LOGOUT;
