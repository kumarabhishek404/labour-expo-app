import USE_LOGOUT from "@/app/hooks/useLogout";
import { checkForUpdates } from "@/components/commons/InAppUpdates";
import { useAtomValue } from "jotai";
import React, { useEffect } from "react";
import Atoms from "../AtomStore";
import REFRESH_USER from "../hooks/useRefreshUser";
import AddServiceScreen from "../screens/addService";
import AdminServices from "../screens/bottomTabs/(admin)/services";

export default function BookingsScreen() {
  const userDetails = useAtomValue(Atoms.UserAtom);
  const { refreshUser } = REFRESH_USER.useRefreshUser();
  const { logout } = USE_LOGOUT.useLogout();

  // useEffect(() => {
  //   const validateUserToken = async () => {
  //     try {
  //       const token = await getToken();

  //       console.log("token--sad", token);

  //       if (!token) {
  //         logout();
  //         return;
  //       }

  //       const response = await AUTH.validateToken();

  //       if (response?.errorCode === "TOKEN_VALID") {
  //         // Do nothing
  //         console.log("Token is valid");
  //         refreshUser();
  //       } else {
  //         // Do nothing
  //         logout(); // 🔥 logout immediately on invalid token
  //       }
  //     } catch (error) {
  //       console.error("Error validating token:", error);
  //       logout(); // 🔥 logout on any error also
  //     }
  //   };

  //   validateUserToken();
  // }, [logout]);

  useEffect(() => {
    checkForUpdates();
  }, []);

  if (userDetails?.isAdmin) return <AdminServices />;
  else return <AddServiceScreen />;
}
