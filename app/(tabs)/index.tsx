import React from "react";
import { useAtomValue } from "jotai";
import Search from "../screens/bottomTabs/(user)/search";
import AdminUsers from "../screens/bottomTabs/(admin)/users";
import Atoms from "../AtomStore";
import AddServiceScreen from "../screens/addService";
import MediatorSearch from "../screens/bottomTabs/(user)/search/mediatoSearch";
import APP_CONTEXT from "../context/locale";
import EmployerSearchScreen from "../screens/bottomTabs/(user)/employer/search";

export default function ProfileScreen() {
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const { role } = APP_CONTEXT.useApp();

  if (userDetails?.isAdmin) return <AdminUsers />;
  else if (role === "MEDIATOR") return <MediatorSearch />;
  else if (role === "EMPLOYER") return <EmployerSearchScreen />;
  else return <Search />;
}
