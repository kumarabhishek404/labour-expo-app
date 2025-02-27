// utils/cleanupNotifications.ts
import Atoms from "@/app/AtomStore";
import { getDefaultStore } from "jotai";

const store = getDefaultStore();

console.log("Atoms?.appearedNotificationsAtom --", Atoms?.unreadNotificationIdsAtom);

export const cleanOldNotifications = () => {
  setInterval(() => {
    store.set(Atoms?.appearedNotificationsAtom, []);
    console.log("Old notifications cleared from storage");
  }, 7 * 24 * 60 * 60 * 1000); // Weekly interval
};
