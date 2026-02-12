import { useAtomValue } from "jotai";
import React, { useEffect } from "react";
import Atoms from "../AtomStore";
import AddServiceScreen from "../screens/addService";
import AdminServices from "../screens/bottomTabs/(admin)/services";

export default function BookingsScreen() {
  const userDetails = useAtomValue(Atoms.UserAtom);

  if (userDetails?.isAdmin) return <AdminServices />;
  else return <AddServiceScreen />;
}
