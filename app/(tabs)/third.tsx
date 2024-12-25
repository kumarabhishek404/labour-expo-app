import React from "react";
import { useAtomValue } from "jotai";
import { UserAtom } from "@/app/AtomStore/user";
import AdminSettings from "../screens/bottomTabs/(admin)/settings";
import AddServiceScreen from "./addService";
import HelpScreen from "../screens/helps";

export default function HomeScreen() {
  const userDetails = useAtomValue(UserAtom);

  switch (userDetails?.role) {
    case "ADMIN":
      return <AdminSettings />;
    case "EMPLOYER":
    case "MEDIATOR":
      return <AddServiceScreen />;
    case "WORKER":
      return <HelpScreen />;
    default:
      return <HelpScreen />;
  }
}
