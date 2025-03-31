import React from "react";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import AdminProfile from "../screens/bottomTabs/(admin)/profile";
import UserProfile from "../screens/bottomTabs/(user)/profile";

export default function WorkersScreen() {
  const userDetails = useAtomValue(Atoms?.UserAtom);

  if (userDetails?.isAdmin) return <AdminProfile />;
  else return <UserProfile />;
}
