import React, { useEffect } from "react";
import { useAtomValue } from "jotai";
import Atoms from "../AtomStore";
import USE_LOGOUT from "@/app/hooks/useLogout";
import { getToken } from "@/utils/authStorage";
import AUTH from "../api/auth";
import AdminServices from "../screens/bottomTabs/(admin)/services";
import AddServiceScreen from "../screens/addService";

export default function BookingsScreen() {
  const userDetails = useAtomValue(Atoms.UserAtom);

  useEffect(() => {
    const validateUserToken = async () => {
      try {
        const token = await getToken();

        if (!token) {
          USE_LOGOUT?.useLogout();
          return;
        }

        const response = await AUTH.validateToken();

        if (response?.errorCode === "TOKEN_VALID") {
          // Do nothing
          console.log("Token is valid");
        } else {
          // Do nothing
          USE_LOGOUT?.useLogout(); // 🔥 logout immediately on invalid token
        }
      } catch (error) {
        console.error("Error validating token:", error);
        USE_LOGOUT?.useLogout(); // 🔥 logout on any error also
      }
    };

    validateUserToken();
  }, [USE_LOGOUT?.useLogout]);

  if (userDetails?.isAdmin) return <AdminServices />;
  else return <AddServiceScreen />;
}
