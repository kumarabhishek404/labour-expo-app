import React from "react";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import AdminServices from "../screens/bottomTabs/(admin)/services";
import UserHome from "../screens/bottomTabs/(user)/home";
import AddServiceScreen from "../screens/addService";

export default function BookingsScreen() {
  const userDetails = useAtomValue(Atoms?.UserAtom);

  if (userDetails?.isAdmin) return <AdminServices />;
  else return <AddServiceScreen />;
}