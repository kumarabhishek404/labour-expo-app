import React from "react";
import { Text, View } from "react-native";
import { useAtomValue } from "jotai";
import { UserAtom } from "@/app/AtomStore/user";
import AdminProfile from "../screens/bottomTabs/(admin)/profile";
import UserProfile from "../screens/bottomTabs/(user)/profile";

export default function WorkersScreen() {
  const userDetails = useAtomValue(UserAtom);

  switch (userDetails?.role) {
    case "ADMIN":
      return <AdminProfile />;
    case "EMPLOYER":
    case "WORKER":
    case "MEDIATOR":
      return <UserProfile />;
    default:
      return <UserProfile />;
  }
}
