import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSetAtom } from "jotai";
import Atoms from "@/app/AtomStore"; // Your atom store
import { useRouter } from "expo-router"; // If you are using expo-router navigation

const useLogout = () => {
  const setIsLoggedIn = useSetAtom(Atoms.IsLoggedInAtom);
  const router = useRouter();

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token"); // If you store token separately
      setIsLoggedIn(false);
      router.replace("/screens/auth/login"); // Or wherever your login screen route is
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return logout;
};

const USE_LOGOUT = {
  useLogout,
};

export default USE_LOGOUT;
