import React from "react";
import { useAtomValue } from "jotai";
import { UserAtom } from "@/app/AtomStore/user";
import AdminServices from "../screens/bottomTabs/(admin)/services";
import UserHome from "../screens/bottomTabs/(user)/home";

export default function BookingsScreen() {
  const userDetails = useAtomValue(UserAtom);

  switch (userDetails?.role) {
    case "ADMIN":
      return <AdminServices />;
    case "EMPLOYER":
    case "WORKER":
    case "MEDIATOR":
      return <UserHome />;
    default:
      return <UserHome />;
  }
}
