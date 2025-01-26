import React from "react";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import AdminUsers from "../../screens/bottomTabs/(admin)/users";
import UserBookingsAndMyServices from "../../screens/bottomTabs/(user)/bookings";

export default function HelpScreen() {
  const userDetails = useAtomValue(Atoms?.UserAtom);

  switch (userDetails?.role) {
    case "ADMIN":
      return <AdminUsers />;
    case "EMPLOYER":
    case "WORKER":
    case "MEDIATOR":
      return <UserBookingsAndMyServices />;
    default:
      return <UserBookingsAndMyServices />;
  }
}
