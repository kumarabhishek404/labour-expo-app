import React from "react";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import AdminRequests from "../../screens/bottomTabs/(admin)/requests";
import UserWorkers from "../../screens/bottomTabs/(user)/workers";

export default function ProfileScreen() {
  const userDetails = useAtomValue(Atoms?.UserAtom);

  switch (userDetails?.role) {
    case "ADMIN":
      return <AdminRequests />;
    case "EMPLOYER":
    case "WORKER":
    case "MEDIATOR":
      return <UserWorkers />;
    default:
      return <UserWorkers />;
  }
}
