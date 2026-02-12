import React from "react";
import { useAtomValue } from "jotai";
import Search from "../screens/bottomTabs/(user)/search";
import AdminUsers from "../screens/bottomTabs/(admin)/users";
import Atoms from "../AtomStore";

export default function ProfileScreen() {
  const userDetails = useAtomValue(Atoms?.UserAtom);

  if (userDetails?.isAdmin) return <AdminUsers />;
  else return <Search />;
}
