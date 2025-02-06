import React from "react";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import AdminUsers from "../screens/bottomTabs/(admin)/users";
import UserBookingsAndMyServices from "../screens/bottomTabs/(user)/bookings";
import BookingsAndRequests from "../screens/bottomTabs/(user)/bookingsAndRequests";

export default function HelpScreen() {
  const userDetails = useAtomValue(Atoms?.UserAtom);

  if (userDetails?.isAdmin) return <AdminUsers />;
  else return <BookingsAndRequests />;
}
