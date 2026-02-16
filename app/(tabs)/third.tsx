import React from "react";
import { useAtomValue } from "jotai";
import AdminRequests from "../screens/bottomTabs/(admin)/requests";
import Atoms from "../AtomStore";
import APP_CONTEXT from "../context/locale";
import EmployerWorkRequests from "../screens/bottomTabs/(user)/bookingsAndRequests/employerWorkRequests";
import WorkerWorkRequests from "../screens/bottomTabs/(user)/bookingsAndRequests/workerWorkRequests";
import MediatorWorkRequests from "../screens/bottomTabs/(user)/bookingsAndRequests/mediatorWorkRequests";

export default function HelpScreen() {
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const { role } = APP_CONTEXT.useApp();

  if (userDetails?.isAdmin) return <AdminRequests />;
  else if (role === "MEDIATOR") return <MediatorWorkRequests />;
  else if (role === "EMPLOYER") return <EmployerWorkRequests />;
  else return <WorkerWorkRequests />;
}
