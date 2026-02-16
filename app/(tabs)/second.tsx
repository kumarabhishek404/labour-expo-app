import { useAtomValue } from "jotai";
import React, { useEffect } from "react";
import Atoms from "../AtomStore";
import AddServiceScreen from "../screens/addService";
import AdminServices from "../screens/bottomTabs/(admin)/services";
import APP_CONTEXT from "../context/locale";
import EmployerBookings from "../screens/bottomTabs/(user)/bookingsAndRequests/employerBookings";
import WorkerBookings from "../screens/bottomTabs/(user)/bookingsAndRequests/workerBookings";
import MediatorDashboard from "../screens/bottomTabs/(user)/bookingsAndRequests/mediatorBookings";

export default function BookingsScreen() {
  const userDetails = useAtomValue(Atoms.UserAtom);
  const { role } = APP_CONTEXT.useApp();

  if (userDetails?.isAdmin) return <AdminServices />;
  else if (role === "MEDIATOR") return <MediatorDashboard />;
  else if (role === "EMPLOYER") return <EmployerBookings />;
  else return <WorkerBookings />;
}
