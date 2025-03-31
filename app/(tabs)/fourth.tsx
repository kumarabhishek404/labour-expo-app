import React from "react";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import BookingsAndRequests from "../screens/bottomTabs/(user)/bookingsAndRequests";
import AdminRequests from "../screens/bottomTabs/(admin)/requests";
import Requests from "../screens/bottomTabs/(user)/bookingsAndRequests/requests";

export default function HelpScreen() {
  const userDetails = useAtomValue(Atoms?.UserAtom);

  if (userDetails?.isAdmin) return <AdminRequests />;
  else return <Requests />;
}
