import React from "react";
import { useAtomValue } from "jotai";
import { UserAtom } from "@/app/AtomStore/user";
import AdminRequests from "../../screens/bottomTabs/(admin)/requests";
import UserWorkers from "../../screens/bottomTabs/(user)/workers";

export default function ProfileScreen() {
  const userDetails = useAtomValue(UserAtom);

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
