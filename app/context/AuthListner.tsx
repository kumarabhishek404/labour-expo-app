import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Atoms from "../AtomStore";
import API_CLIENT from "../api";

const AuthListener = () => {
  const setUserDetails = useSetAtom(Atoms.UserAtom);
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      console.warn("Logging out user...");

      await AsyncStorage.removeItem("user"); // Remove from storage
      setUserDetails(null); // Clear user atom globally
      router.push("/screens/auth/login"); // Redirect to login
    };

    API_CLIENT?.eventEmitter.on("logout", handleLogout);

    return () => {
      API_CLIENT?.eventEmitter.off("logout", handleLogout);
    };
  }, []);

  return null;
};

export default AuthListener;
