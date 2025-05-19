import React from "react";
import { useAtomValue } from "jotai";
import BookingsAndRequests from "../screens/bottomTabs/(user)/bookingsAndRequests";
import AdminRequests from "../screens/bottomTabs/(admin)/requests";
import Bookings from "../screens/bottomTabs/(user)/bookingsAndRequests/bookings";
import Atoms from "../AtomStore";

export default function HelpScreen() {
  const userDetails = useAtomValue(Atoms?.UserAtom);

  if (userDetails?.isAdmin) return <AdminRequests />;
  else return <Bookings />;
}
