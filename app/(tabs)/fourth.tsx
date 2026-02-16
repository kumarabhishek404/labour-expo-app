// import React from "react";
// import { useAtomValue } from "jotai";
// import BookingsAndRequests from "../screens/bottomTabs/(user)/bookingsAndRequests";
// import AdminRequests from "../screens/bottomTabs/(admin)/requests";
// import Requests from "../screens/bottomTabs/(user)/bookingsAndRequests/requests";
// import Atoms from "../AtomStore";

// export default function HelpScreen() {
//   const userDetails = useAtomValue(Atoms?.UserAtom);

//   if (userDetails?.isAdmin) return <AdminRequests />;
//   else return <BookingsAndRequests />;
// }


import React from "react";
import { useAtomValue } from "jotai";
import Atoms from "../AtomStore";
import AdminProfile from "../screens/bottomTabs/(admin)/profile";
import UserProfile from "../screens/bottomTabs/(user)/profile";

export default function WorkersScreen() {
  const userDetails = useAtomValue(Atoms?.UserAtom);

  if (userDetails?.isAdmin) return <AdminProfile />;
  else return <UserProfile />;
}
