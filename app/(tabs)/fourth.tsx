import React from "react";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import AdminRequests from "../screens/bottomTabs/(admin)/requests";
import UserWorkers from "../screens/bottomTabs/(user)/workers";
import Search from "../screens/bottomTabs/(user)/search";

export default function ProfileScreen() {
  const userDetails = useAtomValue(Atoms?.UserAtom);

  if (userDetails?.isAdmin) return <AdminRequests />;
  else return <Search />;
}
