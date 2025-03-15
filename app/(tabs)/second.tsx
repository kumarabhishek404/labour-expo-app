import React from "react";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import Search from "../screens/bottomTabs/(user)/search";
import AdminUsers from "../screens/bottomTabs/(admin)/users";

export default function ProfileScreen() {
  const userDetails = useAtomValue(Atoms?.UserAtom);

  if (userDetails?.isAdmin) return <AdminUsers />;
  else return <Search />;
}
